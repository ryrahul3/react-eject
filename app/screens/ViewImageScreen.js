import React, { useState } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import { Video } from "expo-av";

import colors from "../config/color";

const { width, height } = Dimensions.get("window");

function ViewImageScreen({ route }) {
  const { uri } = route.params;
  if (uri.toString().endsWith(".mp4")) {
    return (
      <View style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: uri }}
          rate={1.0}
          volume={5.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay={true}
          isLooping={false}
          useNativeControls
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image resizeMode="contain" style={styles.image} source={{ uri: uri }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    alignItems: "center",
  },
  closeIcon: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    position: "absolute",
    top: 40,
    left: 30,
  },
  deleteIcon: {
    width: 50,
    height: 50,
    backgroundColor: colors.secondary,
    position: "absolute",
    top: 40,
    right: 30,
  },
  image: {
    width: width,
    height: height,
  },
  video: {
    width: width,
    height: height,
  },
});
export default ViewImageScreen;
