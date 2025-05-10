import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Search, BookOpen, FileText, MessageSquare, ChevronRight, FileCheck, ChartBar as BarChart3 } from 'lucide-react-native';
import { LegalResource } from '@/types/incidents';
import { useTheme } from '@/context/ThemeContext';

const legalResources: LegalResource[] = [
  {
    id: '1',
    title: 'Workplace Harassment Laws',
    description: 'Understanding your rights in the workplace',
    category: 'law',
    content: 'Detailed information about workplace harassment laws...'
  },
  {
    id: '2',
    title: 'Filing a Police Complaint',
    description: 'Step-by-step guide to filing a police complaint',
    category: 'procedure',
    content: 'How to file a police complaint effectively...'
  },
  {
    id: '3',
    title: 'Domestic Violence Protection',
    description: 'Legal protections against domestic violence',
    category: 'rights',
    content: 'Understanding domestic violence laws and protections...'
  },
  {
    id: '4',
    title: 'Online Harassment Laws',
    description: 'Legal framework for cyber harassment',
    category: 'law',
    content: 'Laws related to online harassment and cyberbullying...'
  },
  {
    id: '5',
    title: 'Evidence Collection Guide',
    description: 'How to collect and preserve evidence',
    category: 'procedure',
    content: 'Proper methods for collecting and preserving evidence...'
  },
];

const categories = [
  { id: 'all', name: 'All Resources', icon: BookOpen },
  { id: 'law', name: 'Laws & Acts', icon: FileCheck },
  { id: 'rights', name: 'Know Your Rights', icon: BarChart3 },
  { id: 'procedure', name: 'Procedures', icon: FileText },
];

export default function LegalHelpScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hi, I'm your legal assistant. How can I help you today?", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [activeTab, setActiveTab] = useState<'resources' | 'chat'>('resources');
  
  const filteredResources = legalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleChatSend = () => {
    if (chatInput.trim()) {
      // Add user message
      setChatMessages([...chatMessages, { text: chatInput, isUser: true }]);
      
      // Simulate AI response
      setTimeout(() => {
        const botResponses = [
          "I understand your concern. Here's some information that might help...",
          "That's a good question. According to the law...",
          "I'd recommend seeking professional legal advice for your specific situation.",
          "Let me guide you through the process of filing a complaint.",
          "You have the right to seek legal protection in this situation."
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
      
      setChatInput('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Typography variant="h4" color={colors.white}>Legal Resources</Typography>
        <Typography variant="body2" color={colors.white}>Knowledge is power</Typography>
      </View>
      
      <View style={[styles.tabsContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'resources' && { borderBottomColor: theme.primary }
          ]}
          onPress={() => setActiveTab('resources')}
        >
          <BookOpen size={18} color={activeTab === 'resources' ? theme.primary : theme.text} />
          <Typography 
            variant="body2" 
            color={activeTab === 'resources' ? theme.primary : theme.text}
            style={styles.tabText}
          >
            Resources
          </Typography>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'chat' && { borderBottomColor: theme.primary }
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <MessageSquare size={18} color={activeTab === 'chat' ? theme.primary : theme.text} />
          <Typography 
            variant="body2" 
            color={activeTab === 'chat' ? theme.primary : theme.text}
            style={styles.tabText}
          >
            Legal Assistant
          </Typography>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'resources' ? (
        <View style={styles.resourcesContainer}>
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search legal resources..."
              value={searchQuery}
              onChangeText={handleSearch}
              leftIcon={<Search size={20} color={theme.text} />}
              style={styles.searchInput}
            />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryOption,
                  selectedCategory === category.id && { backgroundColor: theme.primary }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={18} 
                  color={selectedCategory === category.id ? colors.white : theme.text} 
                />
                <Typography 
                  variant="body2" 
                  color={selectedCategory === category.id ? colors.white : theme.text}
                  style={styles.categoryText}
                >
                  {category.name}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <FlatList
            data={filteredResources}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={[styles.resourceCard, { backgroundColor: theme.card }]}>
                <View style={styles.resourceHeader}>
                  <View 
                    style={[
                      styles.categoryBadge,
                      { 
                        backgroundColor: 
                          item.category === 'law' ? theme.primary + '20' : 
                          item.category === 'rights' ? theme.secondary + '20' : 
                          theme.accent + '20'
                      }
                    ]}
                  >
                    <Typography 
                      variant="caption"
                      color={
                        item.category === 'law' ? theme.primary : 
                        item.category === 'rights' ? theme.secondary : 
                        theme.accent
                      }
                    >
                      {item.category.toUpperCase()}
                    </Typography>
                  </View>
                </View>
                
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  {item.title}
                </Typography>
                
                <Typography variant="body2" style={{ color: theme.text }}>
                  {item.description}
                </Typography>
                
                <Button
                  title="Read More"
                  onPress={() => {}}
                  variant="ghost"
                  icon={<ChevronRight size={18} color={theme.primary} />}
                  style={styles.readMoreButton}
                  textStyle={{ color: theme.primary }}
                />
              </Card>
            )}
            contentContainerStyle={styles.resourceList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <FlatList
            data={chatMessages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[
                styles.chatMessage,
                item.isUser ? styles.userMessage : styles.botMessage,
                { backgroundColor: item.isUser ? theme.primary : theme.card }
              ]}>
                <Typography 
                  variant="body2" 
                  color={item.isUser ? colors.white : theme.text}
                >
                  {item.text}
                </Typography>
              </View>
            )}
            contentContainerStyle={styles.chatMessages}
          />
          
          <View style={[styles.chatInputContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            <Input
              placeholder="Type your message..."
              value={chatInput}
              onChangeText={setChatInput}
              style={styles.chatInput}
            />
            <Button
              title="Send"
              onPress={handleChatSend}
              disabled={!chatInput.trim()}
              style={styles.sendButton}
            />
          </View>
        </View>
      )}
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    marginLeft: spacing.xs,
  },
  resourcesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.round,
  },
  categoryText: {
    marginLeft: spacing.xs,
  },
  resourceList: {
    paddingBottom: spacing.xxl,
  },
  resourceCard: {
    marginBottom: spacing.md,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: spacing.xs,
  },
  chatContainer: {
    flex: 1,
  },
  chatMessages: {
    padding: spacing.md,
  },
  chatMessage: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  chatInput: {
    flex: 1,
    marginRight: spacing.sm,
    marginBottom: 0,
  },
  sendButton: {
    width: 80,
  },
});