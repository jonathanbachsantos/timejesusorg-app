import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

// Define as props do componente
interface VideoScreenProps {
  videoID: string | null; // videoID pode ser uma string ou null caso não seja fornecido
}

const VideoScreen: React.FC<VideoScreenProps> = ({ videoID }) => {
  if (!videoID) {
    return (
      <View style={styles.errorContainer}>
        <Text>Nenhum vídeo encontrado.</Text>
      </View>
    );
  }

  return (
    <WebView
      style={styles.video}
      source={{ uri: `https://www.youtube.com/embed/${videoID}?rel=0&controls=0&showinfo=0` }}
    />
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    borderRadius:16,
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
});

export default VideoScreen;
