import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { Chrome as Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Typography variant="h2" style={styles.title}>Page Not Found</Typography>
        <Typography variant="body1" style={styles.text}>
          The page you're looking for doesn't exist or may have been moved.
        </Typography>
        <Link href="/" asChild>
          <Button 
            title="Go to Home Screen" 
            onPress={() => {}} 
            icon={<Home size={20} color={colors.white} />}
            style={styles.button}
          />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  title: {
    marginBottom: spacing.md,
    color: colors.primary[600],
  },
  text: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.gray[600],
  },
  button: {
    marginTop: spacing.md,
  },
});