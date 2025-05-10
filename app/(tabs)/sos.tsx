import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Linking,
  Share,
  Vibration,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import EmergencyButton from '@/components/EmergencyButton';
import Input from '@/components/Input';
import { Phone, MapPin, CirclePlus as PlusCircle, TriangleAlert as AlertTriangle, Bell, Users, Navigation, Smartphone } from 'lucide-react-native';
import { EmergencyContact } from '@/types/incidents';
import { useTheme } from '@/context/ThemeContext';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

export default function SOSScreen() {
  const { theme } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Emergency Helpline', phone: '100', relationship: 'Police' },
    { id: '2', name: 'Women Helpline', phone: '1098', relationship: 'Support' },
  ]);
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  
  const [shareLocation, setShareLocation] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [useSound, setUseSound] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      sendLocationToContacts();
      setCountdown(null);
    }
  }, [countdown]);

  const getLocationString = () => {
    if (!location) return 'Location not available';
    return `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    return phone.replace(/\D/g, '');
  };

  const sendWhatsAppMessage = async (phone: string, message: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      }
    } catch (error) {
      console.log('Error sending WhatsApp message:', error);
    }
  };

  const sendSMS = async (phone: string, message: string) => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      if (Platform.OS === 'android') {
        // For Android, use the native SMS intent
        const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
        await Linking.openURL(smsUrl);
      } else {
        // For iOS, use the SMS module
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          await SMS.sendSMSAsync([formattedPhone], message);
        } else {
          // Fallback to phone call
          await Linking.openURL(`tel:${formattedPhone}`);
        }
      }
    } catch (error) {
      console.log('Error sending SMS:', error);
      // Fallback to phone call
      try {
        await Linking.openURL(`tel:${formatPhoneNumber(phone)}`);
      } catch (fallbackError) {
        console.log('Error with fallback:', fallbackError);
      }
    }
  };

  const sendLocationToContacts = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your location. Please check your location settings.');
      return;
    }

    const locationUrl = getLocationString();
    const message = `EMERGENCY ALERT! I need help. My current location: ${locationUrl}`;

    // Send to all emergency contacts
    for (const contact of emergencyContacts) {
      try {
        // Send SMS first
        await sendSMS(contact.phone, message);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then send WhatsApp message
        await sendWhatsAppMessage(contact.phone, message);
      } catch (error) {
        console.log(`Error sending to contact ${contact.name}:`, error);
      }
    }

    // Vibrate to indicate completion
    Vibration.vibrate([0, 500, 200, 500]);
  };

  const startCountdown = () => {
    setCountdown(5); // 5 second countdown
    const interval = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    countdownRef.current = interval as unknown as NodeJS.Timeout;
  };

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
    Vibration.vibrate([0, 100, 100, 100]); // Short vibration to indicate cancellation
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Alert',
      'This will share your location with your emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share Location', 
          style: 'destructive',
          onPress: () => {
            if (shareLocation) {
              startCountdown();
            }
          } 
        },
      ]
    );
  };
  
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([
        ...emergencyContacts,
        {
          id: Date.now().toString(),
          name: newContact.name,
          phone: newContact.phone,
          relationship: newContact.relationship || 'Contact',
        },
      ]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setIsAddingContact(false);
    } else {
      Alert.alert('Missing Information', 'Please provide both name and phone number.');
    }
  };
  
  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Typography variant="h4" color={colors.white}>Emergency SOS</Typography>
        <Typography variant="body2" color={colors.white}>Quick access to help</Typography>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.emergencyButtonContainer, { backgroundColor: theme.background }]}>
          <EmergencyButton onPress={handleEmergency} />
          {countdown !== null ? (
            <View style={styles.countdownContainer}>
              <Typography variant="h4" style={{ color: theme.error, marginTop: spacing.sm }}>
                {countdown}
              </Typography>
              <Button
                title="Cancel"
                onPress={cancelCountdown}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          ) : (
            <Typography variant="body2" style={{ color: theme.text }}>
              Press the SOS button in case of emergency to share your location
          </Typography>
          )}
        </View>
        
        <Card style={{ backgroundColor: theme.card, marginBottom: spacing.md }}>
          <Typography variant="subtitle1" style={{ color: theme.text }}>
            SOS Settings
          </Typography>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MapPin size={20} color={theme.primary} />
              <Typography variant="body2" style={{ color: theme.text }}>Share Location</Typography>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={shareLocation ? theme.primary : theme.background}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={theme.primary} />
              <Typography variant="body2" style={{ color: theme.text }}>Send Notifications</Typography>
            </View>
            <Switch
              value={sendNotification}
              onValueChange={setSendNotification}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={sendNotification ? theme.primary : theme.background}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Smartphone size={20} color={theme.primary} />
              <Typography variant="body2" style={{ color: theme.text }}>Use Sound</Typography>
            </View>
            <Switch
              value={useSound}
              onValueChange={setUseSound}
              trackColor={{ false: theme.border, true: theme.primary + '80' }}
              thumbColor={useSound ? theme.primary : theme.background}
            />
          </View>
        </Card>
        
        <Card style={{ backgroundColor: theme.card, marginBottom: spacing.md }}>
          <View style={styles.contactsHeader}>
            <Typography variant="subtitle1" style={{ color: theme.text }}>
              Emergency Contacts
            </Typography>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => setIsAddingContact(true)}
            >
              <PlusCircle size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          {isAddingContact ? (
            <View style={styles.addContactForm}>
              <Input
                label="Name"
                placeholder="Contact name"
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
              />
              <Input
                label="Phone"
                placeholder="Phone number"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                keyboardType="phone-pad"
              />
              <Input
                label="Relationship (Optional)"
                placeholder="e.g., Family, Friend"
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
              />
              <View style={styles.formButtons}>
                <Button 
                  title="Cancel" 
                  onPress={() => setIsAddingContact(false)}
                  variant="outline" 
                  style={styles.formButton}
                />
                <Button 
                  title="Add Contact"
                  onPress={handleAddContact}
                  style={styles.formButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.contactsList}>
              {emergencyContacts.map((contact) => (
                <View key={contact.id} style={[styles.contactItem, { borderBottomColor: theme.border }]}>
                  <View style={styles.contactInfo}>
                    <Typography variant="subtitle2" style={{ color: theme.text }}>{contact.name}</Typography>
                    <Typography variant="body2" style={{ color: theme.text }}>{contact.phone}</Typography>
                    <Typography variant="caption" style={{ color: theme.text }}>{contact.relationship}</Typography>
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => {
                        Linking.openURL(`tel:${contact.phone}`);
                      }}
                    >
                      <Phone size={18} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => handleDeleteContact(contact.id)}
                    >
                      <AlertTriangle size={18} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>
        
        <Card style={{ backgroundColor: theme.card, marginBottom: spacing.md }}>
          <Typography variant="subtitle1" style={{ color: theme.text }}>
            Safe Routes
          </Typography>
          <Typography variant="body2" style={{ color: theme.text }}>
            Get directions for safer paths based on community safety reports
          </Typography>
          
          <View style={styles.safeRouteButton}>
            <TouchableOpacity style={[styles.safeRouteButtonInner, { backgroundColor: theme.secondary + '20' }]}>
              <Navigation size={22} color={theme.secondary} />
              <Typography variant="body2" color={theme.secondary} style={styles.safeRouteText}>
                Plan a Safe Route
              </Typography>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emergencyButtonContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  settingsCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: spacing.sm,
  },
  contactsCard: {
    marginBottom: spacing.md,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactForm: {
    marginTop: spacing.sm,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  formButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  contactsList: {
    marginTop: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactAction: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  safetyCard: {
    marginBottom: spacing.md,
  },
  safeRouteButton: {
    marginTop: spacing.md,
  },
  safeRouteButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  safeRouteText: {
    marginLeft: spacing.sm,
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelButton: {
    marginTop: spacing.md,
    minWidth: 120,
  },
});