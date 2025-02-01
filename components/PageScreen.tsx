// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { fetchPageById } from '@/services/api'

import { WebView } from "react-native-webview";

interface Page {
  id: number
  title: { rendered: string }
  content: { rendered: string }
}

const PageScreen: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<Page>({id:1, title:{rendered:""}, content:{rendered:""}})

  

  useEffect(() => {
    const loadPage = async () => {
      try {
        const data = await fetchPageById(819)
        setPage(data)
      } catch (error) {
        console.error('Erro ao carregar a página:', error)
      }
    }

    loadPage()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Carregando...</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>{page.title.rendered}</Text>
      <WebView style={styles.webViewStyle}
      source={{ html: page.content.rendered  }}
    /></View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  webViewStyle: {
    borderRadius:16,
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
})

export default PageScreen
