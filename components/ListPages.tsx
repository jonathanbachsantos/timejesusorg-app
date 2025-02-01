// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { fetchPages } from '@/services/api'

const ListPages: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])

  useEffect(() => {
    const loadPages = async () => {
      try {
        const data = await fetchPages()
        setPages(data)
      } catch (error) {
        console.error('Erro ao carregar páginas:', error)
      }
    }

    loadPages()
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
      <FlatList
        data={pages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.title.rendered}</ThemedText>
          </View>
        )}
      />
    </View>
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
})

export default ListPages
