import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import db from '../Config';
import firebase from 'firebase';

import Home from '../Screens/HomeScreen';
import UserInfo from '../Screens/UserInfo';

export const AppStackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserInfo: {
      screen: UserInfo,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: 'Home' }
);
