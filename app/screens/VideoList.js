import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ViewVideoListScreen from './ViewVideoScreen';
import ViewPager from '@react-native-community/viewpager';

import Data from '../../data.json';

export default function VideoList({ navigation }) {
  const [active, setActive] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <ViewPager
        onPageSelected={(e) => {
          setActive(e.nativeEvent.position);
        }}
        style={styles.viewPager}
        initialPage={0}
        orientation='vertical'
      >
        {Data.feed.map((item) => (
          <View style={styles.page} key={item.id}>
            <ViewVideoListScreen item={item} play={Number(item.id) === active} />
          </View>
        ))}
      </ViewPager>
    </View>
  );
}

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
