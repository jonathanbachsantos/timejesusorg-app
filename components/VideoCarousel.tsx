import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native'
import VideoScreen from './VideoScreen'
import { getLast10PostsWithVideo } from '@/services/api'

const { width } = Dimensions.get('window')

const VideoCarousel: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

 // const player = useVideoPlayer(videoSource, player => {
 //   player.loop = true;
//    player.play();
//  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const videoPosts = await getLast10PostsWithVideo()
        setPosts(videoPosts)
      } catch (error) {
        console.error('Erro ao carregar posts de vídeo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideWidth = width * 0.8
    const scrollX = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollX / slideWidth)
    setActiveIndex(index)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#fff' />
      </View>
    )
  }

  if (!posts.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nenhum post de vídeo encontrado.</Text>
      </View>
    )
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
        decelerationRate='fast'
      >
        {posts.map((post, index) => (
          <View
            key={post.id}
            style={[styles.slide, index === activeIndex && styles.activeSlide]}
          >
            
              <VideoScreen videoID={post.videoID} />
           
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(3, 3, 3, 0.2)',
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
    backgroundColor: 'rgba(3, 3, 3, 0)',
  },
  activeSlide: {
    transform: [{ scale: 1.05 }],
  },
  videoCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  video: {
    borderRadius:16,
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  excerpt: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
  },
})

export default VideoCarousel
