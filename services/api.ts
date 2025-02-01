import axios from 'axios'
import { substituirCaracteresEspeciais } from '@/utils/converHTMLtoText'

// Base URL da API do WordPress
const BASE_URL = 'https://timejesus.org/wp-json/wp/v2';
const WORDPRESS_API_URL = 'https://timejesus.org/wp-json/wp/v2/posts'
//const WORDPRESS_API_URL = 'https://nurlejol.org/wp-json/wp/v2/posts'
//const WORDPRESS_API_URL = 'https://www.eydengejol.com/wp-json/wp/v2/posts'
//const WORDPRESS_API_URL = 'https://www.molomir.com/wp-json/wp/v2/posts'
//const WORDPRESS_API_URL = 'https://www.paihambarlar.com/wp-json/wp/v2/posts'

const extractYouTubeID = (htmlContent) => {
  const regex = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/;
  const match = htmlContent.match(regex);
  return match ? match[1] : null;
};

// Função para configurar a query string
const fetchPosts = async (params: Record<string, any>) => {
  try {
    const response = await axios.get(WORDPRESS_API_URL, { params })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    throw error
  }
}

// 1. Retornar o último post
export const getLastPost = async () => {
  const posts = await fetchPosts({
    per_page: 1,
    orderby: 'date',
    order: 'desc',
  })
  return posts[0]
}

// 2. Retornar os últimos 10 posts
export const getLast10Posts = async () => {
  return await fetchPosts({ per_page: 10, orderby: 'date', order: 'desc' })
}

// 3. Retornar os últimos 10 posts que contêm imagem
export const getLast10PostsWithImage = async () => {
  return await fetchPosts({
    per_page: 10,
    orderby: 'date',
    order: 'desc',
    _embed: true, // Embeds dados do post, incluindo mídia
  }).then((posts) =>
    posts
      .map((post: any) => ({
        id: post.id,
        title: substituirCaracteresEspeciais(post.title?.rendered) || 'Sem Título',
        excerpt: substituirCaracteresEspeciais(post.excerpt?.rendered) || '',
        image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      }))
      .filter((post: any) => post.image)
  )
}

// 4. Retornar os últimos 10 posts que contêm vídeo
export const getLast10PostsWithVideo = async () => {
  return await fetchPosts({
    per_page: 10,
    orderby: 'date',
    order: 'desc',
    _embed: true,
  }).then((posts) =>
    posts.filter((post: any) => post.content?.rendered.includes('<iframe')).map((post: any) => ({
      ...post,
      videoID: extractYouTubeID(post.content.rendered) || ''
    }))
  )
}

// 5. Retornar os últimos 10 posts que contêm áudio
export const getLast10PostsWithAudio = async () => {
  return await fetchPosts({
    per_page: 10,
    orderby: 'date',
    order: 'desc',
    _embed: true,
  }).then((posts) =>
    posts.filter((post: any) => post.content?.rendered.includes('<audio'))
  )
}

export const getAudioPosts = async () => {
  try {
    const response = await axios.get(WORDPRESS_API_URL, {
      params: {
        per_page: 100,
        orderby: 'date',
        order: 'desc',
        _embed: true,
      },
    });

    // Filtrar posts com áudio
    return response.data.filter((post: any) =>
      post._embedded?.['wp:featuredmedia']?.[0]?.media_type === 'audio'
    );
  } catch (error) {
    console.error('Erro ao buscar posts de áudio:', error);
    throw error;
  }
};

export const getVideoPosts = async () => {
  try {
    const response = await axios.get(WORDPRESS_API_URL, {
      params: {
        per_page: 100,
        orderby: 'date',
        order: 'desc',
        _embed: true,
      },
    });

    // Filtrar posts com vídeos
    return response.data.filter((post: any) =>
      post._embedded?.['wp:featuredmedia']?.[0]?.media_type === 'video'
    );
  } catch (error) {
    console.error('Erro ao buscar posts de vídeo:', error);
    throw error;
  }
};

export const fetchPages = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pages`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    throw error;
  }
};

export const fetchPageById = async (id: number = 819) => {
  try {
    const response = await fetch(`${BASE_URL}/pages/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar a página com ID ${id}:`, error);
    throw error;
  }
};