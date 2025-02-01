import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,  ActivityIndicator } from 'react-native';
import { getLastPost } from '@/services/api';
import { substituirCaracteresEspeciais } from '@/utils/converHTMLtoText';


// Componente principal
const LastPostComponent: React.FC = () => {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // Busca o último post ao montar o componente
    getLastPost().then(setPost).catch(console.error);
  }, []);

  if (!post) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
      <View style={styles.card}>
        <Text style={styles.title}>{substituirCaracteresEspeciais(post.title.rendered)}</Text>
        <Text style={styles.content}>{substituirCaracteresEspeciais(post.excerpt.rendered)}</Text>
      </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  card: {
    margin:16,
    backgroundColor: 'rgba(3, 3, 3, 0.2)',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  content: {
    fontSize: 14,
    color: '#ddd',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 3, 3, 0)',
  },
});

export default LastPostComponent;
