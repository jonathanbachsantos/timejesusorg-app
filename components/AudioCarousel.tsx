import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { getLast10PostsWithAudio } from '@/services/api';


const { width } = Dimensions.get('window');

const WORDPRESS_API_URL = 'https://www.paihambarlar.com/wp-json/wp/v2/posts';



const AudioCarousel: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const audioPosts = await getLast10PostsWithAudio();
        setPosts(audioPosts);
      } catch (error) {
        console.error('Erro ao carregar posts de áudio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async (url: string) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    await newSound.playAsync();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideWidth = width * 0.8;
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / slideWidth);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nenhum post de áudio encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width * 0.8 + 16}
        decelerationRate="fast"
      >
        {posts.map((post, index) => (
          <View key={post.id} style={[styles.slide, index === activeIndex && styles.activeSlide]}>
            <View style={styles.audioCard}>
              <Text style={styles.title}>{post.title.rendered}</Text>
              <Text style={styles.excerpt}>{post.excerpt.rendered.replace(/<[^>]+>/g, '')}</Text>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playAudio(post._embedded?.['wp:featuredmedia']?.[0]?.source_url)}
              >
                <Text style={styles.playButtonText}>▶️ Play Áudio</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  slide: {
    width: width * 0.8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#222',
    padding: 16,
  },
  activeSlide: {
    transform: [{ scale: 1.05 }],
  },
  audioCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AudioCarousel;
