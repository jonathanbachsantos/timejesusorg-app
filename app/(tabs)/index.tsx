import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import LastPostComponent from '@/components/LastPostComponent'
import ManualCarousel from '@/components/ManualCarousel'
import VideoCarousel from '@/components/VideoCarousel'

import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

const { width, height } = Dimensions.get('window')

export default function HomeScreen() {
  const [gradientColors, setGradientColors] = useState<string[]>([])
  // Paleta de cores possíveis
  const COLORS = [
    ['#0f2027', '#203a43', '#2c5364'],
    ['#131c4d', '#7e1414', '#ae8301'],
    ['#2a164e', '#944b51', '#cc8e5c'],
    ['#232526', '#414345', '#6b6b83'],
  ]
  useEffect(() => {
    // Define cores aleatórias
    setGradientColors(COLORS[Math.floor(Math.random() * COLORS.length)])
  }, [])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type='defaultSemiBold'>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type='defaultSemiBold'>npm run reset-project</ThemedText>{' '}
          to get a fresh <ThemedText type='defaultSemiBold'>app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type='defaultSemiBold'>app</ThemedText> to{' '}
          <ThemedText type='defaultSemiBold'>app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.background} />
        {/* Personalização da StatusBar */}
        <StatusBar barStyle='light-content' backgroundColor='#000' />

        <LastPostComponent />
        <VideoCarousel />
        <ManualCarousel />
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
