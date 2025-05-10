import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
  TextStyle
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { 
  Search, 
  MessageCircle, 
  Heart, 
  Eye, 
  Plus,
  Filter,
  Tag,
  ChevronRight,
  Calendar,
  MoreVertical
} from 'lucide-react-native';
import { CommunityPost } from '@/types/incidents';
import { useTheme } from '@/context/ThemeContext';

const communityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'How to handle workplace microaggressions?',
    content: 'I\'ve been experiencing subtle comments at work that make me uncomfortable. Anyone have advice on how to address this professionally?',
    date: new Date('2023-06-15'),
    tags: ['workplace', 'advice'],
    likes: 24,
    responses: 8,
    anonymous: true,
  },
  {
    id: '2',
    title: 'Resources for free legal aid in Delhi',
    content: 'I\'m compiling a list of organizations that offer free legal support for women in Delhi. Please share any recommendations!',
    date: new Date('2023-06-10'),
    tags: ['resources', 'legal'],
    likes: 46,
    responses: 15,
    anonymous: false,
  },
  {
    id: '3',
    title: 'Success story: How I stood up to harassment',
    content: 'I want to share my experience confronting a harasser on public transport and how bystander intervention made all the difference.',
    date: new Date('2023-06-05'),
    tags: ['success', 'public'],
    likes: 123,
    responses: 32,
    anonymous: false,
  },
  {
    id: '4',
    title: 'Tips for online privacy and security',
    content: 'After experiencing cyberstalking, I\'ve learned a lot about protecting myself online. Here are some tips that helped me regain my digital privacy.',
    date: new Date('2023-06-01'),
    tags: ['cyber', 'safety'],
    likes: 78,
    responses: 21,
    anonymous: true,
  },
];

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export default function CommunityScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                          post.tags.includes(activeFilter) ||
                          (activeFilter === 'anonymous' && post.anonymous);
    
    return matchesSearch && matchesFilter;
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Typography variant="h4" color={colors.white}>Community</Typography>
        <Typography variant="body2" color={colors.white}>Support & shared experiences</Typography>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search discussions..."
          value={searchQuery}
          onChangeText={handleSearch}
          leftIcon={<Search size={20} color={theme.text} />}
          style={styles.searchInput}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity 
            style={{
              ...styles.filterButton,
              ...(activeFilter === 'all' ? { backgroundColor: theme.primary } : {})
            }}
            onPress={() => setActiveFilter('all')}
          >
            <Typography 
              variant="body2" 
              color={activeFilter === 'all' ? colors.white : theme.text}
            >
              All
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              ...styles.filterButton,
              ...(activeFilter === 'workplace' ? { backgroundColor: theme.primary } : {})
            }}
            onPress={() => setActiveFilter('workplace')}
          >
            <Typography 
              variant="body2" 
              color={activeFilter === 'workplace' ? colors.white : theme.text}
            >
              Workplace
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              ...styles.filterButton,
              ...(activeFilter === 'cyber' ? { backgroundColor: theme.primary } : {})
            }}
            onPress={() => setActiveFilter('cyber')}
          >
            <Typography 
              variant="body2" 
              color={activeFilter === 'cyber' ? colors.white : theme.text}
            >
              Cyber
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              ...styles.filterButton,
              ...(activeFilter === 'public' ? { backgroundColor: theme.primary } : {})
            }}
            onPress={() => setActiveFilter('public')}
          >
            <Typography 
              variant="body2" 
              color={activeFilter === 'public' ? colors.white : theme.text}
            >
              Public
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              ...styles.filterButton,
              ...(activeFilter === 'anonymous' ? { backgroundColor: theme.primary } : {})
            }}
            onPress={() => setActiveFilter('anonymous')}
          >
            <Typography 
              variant="body2" 
              color={activeFilter === 'anonymous' ? colors.white : theme.text}
            >
              Anonymous
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{
            ...styles.postCard,
            backgroundColor: theme.card
          }}>
            <View style={styles.postHeader}>
              <View style={styles.postInfo}>
                <Typography variant="subtitle2" style={{ color: theme.text }}>
                  {item.anonymous ? 'Anonymous User' : 'Community Member'}
                </Typography>
                <Typography variant="caption" style={{ color: theme.text }}>
                  {formatDate(item.date)}
                </Typography>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Typography 
              variant="h4" 
              style={{
                ...styles.postTitle,
                color: theme.text
              }}
            >
              {item.title}
            </Typography>

            <Typography 
              variant="body2" 
              style={{
                ...styles.postContent,
                color: theme.text
              }}
            >
              {item.content}
            </Typography>

            <View style={styles.tagsContainer}>
              {item.tags.map((tag) => (
                <View 
                  key={tag} 
                  style={[styles.tag, { backgroundColor: theme.primary + '20' }]}
                >
                  <Typography variant="caption" color={theme.primary}>
                    #{tag}
                  </Typography>
                </View>
              ))}
            </View>

            <View style={[styles.postFooter, { borderTopColor: theme.border }]}>
              <View style={styles.postStats}>
                <View style={styles.statItem}>
                  <Heart size={18} color={theme.text} />
                  <Typography variant="caption" style={{ color: theme.text }}>
                    {item.likes}
                  </Typography>
                </View>
                <View style={styles.statItem}>
                  <MessageCircle size={18} color={theme.text} />
                  <Typography variant="caption" style={{ color: theme.text }}>
                    {item.responses}
                  </Typography>
                </View>
                <View style={styles.statItem}>
                  <Eye size={18} color={theme.text} />
                  <Typography variant="caption" style={{ color: theme.text }}>
                    {Math.floor(Math.random() * 1000)}
                  </Typography>
                </View>
              </View>
              <Button
                title="Respond"
                variant="ghost"
                size="sm"
                onPress={() => {}}
                style={styles.respondButton}
                textStyle={{ color: theme.primary }}
              />
            </View>
          </Card>
        )}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={[styles.newPostButton, { backgroundColor: theme.primary }]}
        onPress={() => {}}
      >
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
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
  searchContainer: {
    padding: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  postsList: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  postCard: {
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postInfo: {
    flex: 1,
  },
  moreButton: {
    padding: spacing.xs,
  },
  postTitle: {
    marginBottom: spacing.sm,
  },
  postContent: {
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  postStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  respondButton: {
    paddingHorizontal: 0,
  },
  newPostButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});