import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity, Text, Image } from 'react-native';
import { Video, Audio } from 'expo-av';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

import customStyle from '../config/styles';


function ViewVideoListScreen({ item, play }) {
  const isFocused = useIsFocused();
  const [isPlay, setIsPlay] = useState(true);
  const [isBuffering, setBufferring] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
          playThroughEarpieceAndroid: true,
        });
        await loadAudio();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const loadAudio = async () => {
    try {
      const playback= new Audio.Sound();
      const source = {
        uri: item?.audio,
      };
      const status = {
        shouldPlay: play && isPlay && isFocused,
        volume: 1.0,
      };
      playback.setOnPlaybackStatusUpdate(setBufferring(true));
      await playback.loadAsync(source, status, false);
      setPlaybackInstance(playback);
      console.log({ playbackInstance });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <LinearGradient
        colors={['rgba(0,0,0,.3)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '70%',
        }}
      />
      <View style={styles.videoContainer}>
        <Video
          style={styles.video}
          source={{ uri: item?.uri }}
          rate={1.0}
          volume={1.0}
          isMuted={true}
          resizeMode='cover'
          shouldPlay={play && isPlay && isFocused}
          isLooping={true}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.user}>{item?.username}</Text>
        <Text style={styles.tags}>{item?.tags}</Text>
        <View style={styles.musicBox}>
          <FontAwesome name='music' color='#f5f5f5' size={15} />
          <Text style={styles.music}>{item?.music}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.8} style={styles.boxAction}>
          <AntDesign name='heart' size={35} color='#fff' />
          <Text style={styles.textAction}>{item?.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.boxAction}>
          <FontAwesome name='commenting' size={35} color='#fff' />
          <Text style={styles.textAction}>{item?.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.boxAction}>
          <FontAwesome name='whatsapp' size={35} color='#06d755' />
          <Text style={styles.textAction}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.boxAction}>
          <Image
            style={{
              width: 35,
              height: 35,
              borderRadius: 25,
            }}
            source={{
              uri: item?.image,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={() => setIsPlay(isPlay ? false : true)}>
        <View style={[customStyle.playButton, customStyle.alignCenter]}>{!isPlay && <Ionicons name='md-play' color='white' size={50} />}</View>
      </TouchableWithoutFeedback>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,.4)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '50%',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  details: {
    position: 'absolute',
    width: '65%',
    flexDirection: 'column',
    bottom: 0,
    zIndex: 10,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  user: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
    color: '#fff',
  },
  tags: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    paddingBottom: 5,
    paddingTop: 10,
    color: '#fff',
  },
  musicBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  music: {
    fontSize: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingTop: 5,
    paddingRight: 5,
    flexShrink: 1,
    color: '#fff',
  },
  actions: {
    flexDirection: 'column',
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    bottom: 0,
    right: 10,
    zIndex: 10,
  },
  boxAction: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 10,
  },
  textAction: {
    color: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
export default ViewVideoListScreen;
