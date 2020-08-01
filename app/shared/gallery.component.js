import React from 'react';
import { View, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';

import styles from '../config/styles';

export default ({ captures = [], navigation }) => (
  <ScrollView horizontal={true} style={[styles.bottomToolbar, styles.galleryContainer]}>
    {captures.map(({ uri }) => (
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Video',{uri : uri})}>
        <View style={styles.galleryImageContainer} key={uri}>
          <Image source={{ uri }} style={styles.galleryImage} />
        </View>
      </TouchableWithoutFeedback>
    ))}
  </ScrollView>
);
