import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { getLast10PostsWithImage } from '@/services/api';

const { width } = Dimensions.get('window');

const WordPressCarousel: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsWithImages = await getLast10PostsWithImage();
        setPosts(postsWithImages);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        <Text style={styles.errorText}>Nenhum post com imagem encontrado.</Text>
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
            <ImageBackground source={{ uri: post.image }} style={styles.image} imageStyle={styles.imageStyle}>
              <View style={styles.overlay}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.excerpt}>{post.excerpt.replace(/<[^>]+>/g, '')}</Text>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(3, 3, 3, 0)',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 3, 3, 0)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 3, 3, 0)',
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
  },
  activeSlide: {
    transform: [{ scale: 1.05 }],
  },
  image: {
    height: 200,
    justifyContent: 'flex-start',
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  excerpt: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 8,
  },
});

export default WordPressCarousel;
