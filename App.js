import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './app/screens/ProfileScreen';
import CameraScreen from './app/screens/CameraScreen';
import VideoList from './app/screens/VideoList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ViewImageScreen from './app/screens/ViewImageScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const MainTab = createStackNavigator();
function MainStackScreen() {
  return (
    <MainTab.Navigator headerMode="none">
      <MainTab.Screen name='Camera' component={CameraScreen} />
      <MainTab.Screen name='Video' component={ViewImageScreen} />
    </MainTab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home') {
              return <FontAwesome name={focused ? 'home' : 'home'} size={size} color={color} />;
            } else if (route.name === 'Camera') {
              return <Ionicons name={focused ? 'ios-camera' : 'ios-camera'} size={size} color={color} />;
            } else if (route.name === 'Me') {
              return <FontAwesome name={focused ? 'user-circle' : 'user-circle-o'} size={size} color={color} />;
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name='Home' component={VideoList} />
        <Tab.Screen name='Camera' component={MainStackScreen} />
        <Tab.Screen name='Me' component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
