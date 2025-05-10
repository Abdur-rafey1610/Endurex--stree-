import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  Text,
  Animated,
} from 'react-native';
import { colors, spacing, fonts, borderRadius } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ProgressTracker from '@/components/ProgressTracker';
import { Camera, MapPin, Mic, Lock, ChevronLeft, ChevronRight, Image as ImageIcon, Check, Play, Pause, Square } from 'lucide-react-native';
import { router } from 'expo-router';
import { IncidentType } from '@/types/incidents';
import { useTheme } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

// Incident type option component
interface IncidentTypeOptionProps {
  value: IncidentType;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

function IncidentTypeOption({ 
  value, 
  label, 
  icon, 
  selected, 
  onSelect 
}: IncidentTypeOptionProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.incidentTypeOption,
        selected && styles.incidentTypeSelected
      ]}
      onPress={onSelect}
    >
      <View style={styles.incidentTypeIcon}>
        {icon}
      </View>
      <Typography 
        variant="body2" 
        color={selected ? colors.primary[500] : colors.gray[700]}
      >
        {label}
      </Typography>
      {selected && (
        <View style={styles.checkIcon}>
          <Check size={16} color={colors.primary[500]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function isDocumentPickerSuccessResult(result: any): result is DocumentPicker.DocumentPickerSuccessResult {
  return result && result.type === 'success' && typeof result.uri === 'string';
}

// Add Waveform component
const Waveform = ({ isRecording }: { isRecording: boolean }) => {
  const bars = 20;
  const [amplitudes] = useState(() => 
    Array(bars).fill(0).map(() => new Animated.Value(0))
  );

  useEffect(() => {
    if (isRecording) {
      const animations = amplitudes.map((value, index) => {
        const randomHeight = Math.random() * 0.7 + 0.3; // Random height between 0.3 and 1
        return Animated.sequence([
          Animated.timing(value, {
            toValue: randomHeight,
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
        ]);
      });

      const animate = () => {
        Animated.parallel(animations).start(() => {
          if (isRecording) {
            animate();
          }
        });
      };

      animate();
    } else {
      amplitudes.forEach(value => value.setValue(0.3));
    }
  }, [isRecording]);

  return (
    <View style={styles.waveformContainer}>
      {amplitudes.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: value.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 40],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

export default function ReportScreen() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<{ uri: string, type: string, name?: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const steps = ['Incident Type', 'Details', 'Evidence', 'Submit'];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit report
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would send the report to a server
    // For now, just show a success message and reset the form
    alert('Report submitted anonymously. Your tracking ID: STR-' + Math.floor(Math.random() * 10000));
    
    // Reset form
    setCurrentStep(0);
    setIncidentType(null);
    setDescription('');
    setLocation('');
    setEvidenceFiles([]);
  };

  // Helper for formatting duration
  function formatDuration(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Camera
  const takePhoto = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPerm.granted) {
      alert('Camera permission is required');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEvidenceFiles([
        ...evidenceFiles,
        {
          uri: result.assets[0].uri,
          type: 'photo',
          name: result.assets[0].fileName ?? undefined,
        },
      ]);
    }
  };

  // Gallery
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEvidenceFiles([
        ...evidenceFiles,
        {
          uri: result.assets[0].uri,
          type: 'photo',
          name: result.assets[0].fileName ?? undefined,
        },
      ]);
    }
  };

  // Audio
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone denied');
        return;
      }
      setShowAudioModal(true);
      const rec = new Audio.Recording();
      rec.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) setRecordingDuration(status.durationMillis || 0);
      });
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch (e) {
      alert('Error starting recording: ' + e);
    }
  };
  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setEvidenceFiles([
          ...evidenceFiles,
          { uri, type: 'voice', name: 'VoiceNote.m4a' },
        ]);
      }
    } catch (e) {
      alert('Error stopping recording: ' + e);
    }
    setIsRecording(false);
    setRecording(null);
    setRecordingDuration(0);
    setShowAudioModal(false);
  };

  // Audio playback functions
  const playAudio = async (uri: string, index: number) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      setCurrentAudioIndex(index);
    } catch (e) {
      alert('Error playing audio: ' + e);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentAudioIndex(null);
      setAudioProgress(0);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setAudioProgress(status.positionMillis);
      setAudioDuration(status.durationMillis);
      if (status.didJustFinish) {
        stopAudio();
      }
    }
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Real function to add evidence
  const addEvidence = async (type: 'photo' | 'voice' | 'document') => {
    try {
      if (type === 'photo') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setEvidenceFiles([
            ...evidenceFiles,
            {
              uri: result.assets[0].uri,
              type: 'photo',
              name: result.assets[0].fileName ?? undefined,
            },
          ]);
        }
      } else if (type === 'document') {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
        });
        if (isDocumentPickerSuccessResult(result)) {
          const docResult = result as DocumentPicker.DocumentPickerSuccessResult;
          setEvidenceFiles([
            ...evidenceFiles,
            {
              uri: docResult.uri,
              type: 'document',
              name: docResult.name ?? undefined,
            },
          ]);
        }
      } else if (type === 'voice') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access microphone denied');
          return;
        }
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await recording.startAsync();
        alert('Recording... Press OK to stop');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          setEvidenceFiles([
            ...evidenceFiles,
            { uri, type: 'voice', name: 'VoiceNote.m4a' },
          ]);
        }
      }
    } catch (e) {
      alert('Error adding evidence: ' + e);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Incident Type
        return (
          <View style={styles.stepContent}>
            <Typography variant="subtitle1" style={styles.stepTitle}>
              What type of incident would you like to report?
            </Typography>
            <Typography variant="body2" color={colors.gray[600]} style={styles.stepDescription}>
              Select the category that best describes the incident. This helps us route your report appropriately.
            </Typography>
            
            <View style={styles.incidentTypeContainer}>
              <IncidentTypeOption
                value="workplace"
                label="Workplace"
                icon={<ImageIcon size={24} color={incidentType === 'workplace' ? colors.primary[500] : colors.gray[500]} />}
                selected={incidentType === 'workplace'}
                onSelect={() => setIncidentType('workplace')}
              />
              
              <IncidentTypeOption
                value="cyber"
                label="Cyber"
                icon={<ImageIcon size={24} color={incidentType === 'cyber' ? colors.primary[500] : colors.gray[500]} />}
                selected={incidentType === 'cyber'}
                onSelect={() => setIncidentType('cyber')}
              />
              
              <IncidentTypeOption
                value="public"
                label="Public"
                icon={<ImageIcon size={24} color={incidentType === 'public' ? colors.primary[500] : colors.gray[500]} />}
                selected={incidentType === 'public'}
                onSelect={() => setIncidentType('public')}
              />
              
              <IncidentTypeOption
                value="domestic"
                label="Domestic"
                icon={<ImageIcon size={24} color={incidentType === 'domestic' ? colors.primary[500] : colors.gray[500]} />}
                selected={incidentType === 'domestic'}
                onSelect={() => setIncidentType('domestic')}
              />
              
              <IncidentTypeOption
                value="other"
                label="Other"
                icon={<ImageIcon size={24} color={incidentType === 'other' ? colors.primary[500] : colors.gray[500]} />}
                selected={incidentType === 'other'}
                onSelect={() => setIncidentType('other')}
              />
            </View>
          </View>
        );
        
      case 1: // Details
        return (
          <View style={styles.stepContent}>
            <Typography variant="subtitle1" style={styles.stepTitle}>
              Tell us what happened
            </Typography>
            <Typography variant="body2" color={colors.gray[600]} style={styles.stepDescription}>
              Provide details about the incident. Your report will remain anonymous and secure.
            </Typography>
            
            <Input
              label="Description"
              placeholder="Describe what happened..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
            />
            
            <Input
              label="Location (Optional)"
              placeholder="Where did this happen?"
              value={location}
              onChangeText={setLocation}
              leftIcon={<MapPin size={20} color={colors.gray[500]} />}
            />
          </View>
        );
        
      case 2: // Evidence
        return (
          <View style={styles.stepContent}>
            <Typography variant="subtitle1" style={styles.stepTitle}>
              Add Evidence (Optional)
            </Typography>
            <Typography variant="body2" color={colors.gray[600]} style={styles.stepDescription}>
              You can add photos, voice recordings, or documents to support your report.
            </Typography>

            {/* Evidence Upload Buttons */}
            <View style={styles.evidenceButtonsContainer}>
              <Button
                title="Take Photo"
                icon={<Camera size={20} color={colors.white} />}
                style={{ ...styles.evidenceButton, backgroundColor: colors.primary[500] }}
                onPress={takePhoto}
              />
              <Button
                title="Choose from Gallery"
                icon={<ImageIcon size={20} color={colors.white} />}
                style={{ ...styles.evidenceButton, backgroundColor: colors.secondary[500] }}
                onPress={pickPhoto}
              />
              <Button
                title={isRecording ? `Recording... (${formatDuration(recordingDuration)})` : 'Record Audio'}
                icon={<Mic size={20} color={colors.white} />}
                style={{ ...styles.evidenceButton, backgroundColor: colors.accent[500] }}
                onPress={isRecording ? stopRecording : startRecording}
              />
              <Button
                title="Upload File"
                icon={<ImageIcon size={20} color={colors.white} />}
                style={{ ...styles.evidenceButton, backgroundColor: colors.gray[700] }}
                onPress={() => addEvidence('document')}
              />
            </View>

            {/* Evidence List Section */}
            {evidenceFiles.length > 0 && (
              <View style={styles.evidenceListSection}>
                <Typography variant="subtitle2" style={styles.evidenceListTitle}>
                  Added Evidence ({evidenceFiles.length})
                </Typography>
                <View style={styles.evidenceList}>
                  {evidenceFiles.map((file, index) => (
                    <View key={index} style={styles.evidenceItem}>
                      <View style={styles.evidenceContent}>
                        {file.type === 'photo' ? (
                          <Image source={{ uri: file.uri }} style={styles.evidenceImage} />
                        ) : file.type === 'voice' ? (
                          <View style={styles.audioItem}>
                            <View style={styles.audioControls}>
                              {currentAudioIndex === index && isPlaying ? (
                                <TouchableOpacity onPress={pauseAudio} style={styles.audioButton}>
                                  <Pause size={20} color={colors.primary[500]} />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity onPress={() => playAudio(file.uri, index)} style={styles.audioButton}>
                                  <Play size={20} color={colors.primary[500]} />
                                </TouchableOpacity>
                              )}
                              {currentAudioIndex === index && (
                                <TouchableOpacity onPress={stopAudio} style={styles.audioButton}>
                                  <Square size={20} color={colors.primary[500]} />
                                </TouchableOpacity>
                              )}
                            </View>
                            <View style={styles.audioProgress}>
                              <View style={[styles.audioProgressBar, { width: `${(audioProgress / audioDuration) * 100}%` }]} />
                            </View>
                            <Typography variant="caption" color={colors.gray[600]}>
                              {formatDuration(currentAudioIndex === index ? audioProgress : 0)}
                            </Typography>
                          </View>
                        ) : (
                          <Typography variant="body2" style={styles.evidenceFileName}>
                            {file.name || file.uri.split('/').pop()}
                          </Typography>
                        )}
                      </View>
                      <TouchableOpacity 
                        onPress={() => {
                          if (currentAudioIndex === index) {
                            stopAudio();
                          }
                          const newFiles = [...evidenceFiles];
                          newFiles.splice(index, 1);
                          setEvidenceFiles(newFiles);
                        }}
                        style={styles.removeButton}
                      >
                        <Typography variant="body2" color={colors.error}>Remove</Typography>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Audio Recording Modal */}
            <Modal visible={showAudioModal} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Mic size={40} color={colors.accent[500]} />
                  <Typography variant="h4" style={styles.modalTitle}>
                    Recording...
                  </Typography>
                  <Waveform isRecording={isRecording} />
                  <Typography variant="body1" style={styles.recordingDuration}>
                    {formatDuration(recordingDuration)}
                  </Typography>
                  <Button 
                    title="Stop Recording" 
                    onPress={stopRecording} 
                    style={styles.stopButton}
                    icon={<Square size={20} color={colors.white} />}
                  />
                </View>
              </View>
            </Modal>
          </View>
        );
        
      case 3: // Submit
        return (
          <View style={styles.stepContent}>
            <Typography variant="subtitle1" style={styles.stepTitle}>
              Review and Submit
            </Typography>
            <Typography variant="body2" color={colors.gray[600]} style={styles.stepDescription}>
              Your report will be encrypted and submitted anonymously. You'll receive a tracking ID to check the status.
            </Typography>
            
            <Card style={{ ...styles.summaryCard, backgroundColor: theme.card }}>
              <View style={{ ...styles.summaryItem, backgroundColor: theme.card }}>
                <Typography variant="body2" color={colors.gray[500]}>Type:</Typography>
                <Typography variant="body2">{incidentType}</Typography>
              </View>
              
              <View style={{ ...styles.summaryItem, backgroundColor: theme.card }}>
                <Typography variant="body2" color={colors.gray[500]}>Description:</Typography>
                <Typography variant="body2" style={{ ...styles.summaryDescription, color: theme.text }}>{description}</Typography>
              </View>
              
              {location && (
                <View style={{ ...styles.summaryItem, backgroundColor: theme.card }}>
                  <Typography variant="body2" color={colors.gray[500]}>Location:</Typography>
                  <Typography variant="body2">{location}</Typography>
                </View>
              )}
              
              <View style={{ ...styles.summaryItem, backgroundColor: theme.card }}>
                <Typography variant="body2" color={colors.gray[500]}>Evidence:</Typography>
                <Typography variant="body2">{evidenceFiles.length} files</Typography>
              </View>
            </Card>
            
            <View style={styles.privacyNotice}>
              <Lock size={16} color={colors.primary[500]} />
              <Typography variant="caption" color={colors.primary[700]} style={styles.privacyText}>
                Your report is secure and anonymous. You can track its status using your ID.
              </Typography>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Typography variant="h4" color={colors.white}>Report an Incident</Typography>
        <Typography variant="body2" color={colors.white}>Your voice matters</Typography>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.trackerCard, { backgroundColor: theme.card }]}>
          <ProgressTracker
            steps={steps}
            currentStep={currentStep}
          />
        </Card>
        
        {renderStepContent()}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={goToPreviousStep}
            variant="outline"
            icon={<ChevronLeft size={20} color={theme.primary} />}
            style={styles.backButton}
          />
        )}
        
        <Button
          title={currentStep === steps.length - 1 ? "Submit Report" : "Continue"}
          onPress={goToNextStep}
          icon={currentStep === steps.length - 1 ? <Lock size={20} color={colors.white} /> : <ChevronRight size={20} color={colors.white} />}
          disabled={currentStep === 0 && !incidentType}
          style={styles.nextButton}
        />
      </View>
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
  trackerCard: {
    marginBottom: spacing.md,
  },
  stepContent: {
    marginBottom: spacing.lg,
  },
  stepTitle: {
    marginBottom: spacing.xs,
  },
  stepDescription: {
    marginBottom: spacing.md,
  },
  incidentTypeContainer: {
    marginTop: spacing.sm,
  },
  incidentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  incidentTypeSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  incidentTypeIcon: {
    marginRight: spacing.md,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  evidenceButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  evidenceButton: {
    flex: 1,
    minWidth: 150,
    margin: 0,
  },
  evidenceListSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  evidenceList: {
    marginTop: spacing.sm,
  },
  evidenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  evidenceContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  evidenceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  evidenceFileName: {
    flex: 1,
    marginRight: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  audioItem: {
    flex: 1,
    marginRight: spacing.sm,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  audioButton: {
    padding: 4,
    marginRight: 8,
  },
  audioProgress: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    marginBottom: 4,
  },
  audioProgressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  summaryCard: {
    marginTop: spacing.sm,
  },
  summaryItem: {
    marginBottom: spacing.sm,
  },
  summaryDescription: {
    marginTop: spacing.xs,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  privacyText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  backButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nextButton: {
    flex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    marginVertical: spacing.md,
    color: colors.gray[800],
  },
  recordingDuration: {
    marginVertical: spacing.md,
    color: colors.gray[600],
  },
  stopButton: {
    backgroundColor: colors.error,
    width: 180,
    marginTop: spacing.md,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
    marginVertical: spacing.md,
  },
  waveformBar: {
    width: 3,
    backgroundColor: colors.accent[500],
    marginHorizontal: 2,
    borderRadius: 2,
  },
});