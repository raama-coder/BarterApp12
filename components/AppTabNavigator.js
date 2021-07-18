import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from "../Screens/HomeScreen"
import ExchangeScreen from "../Screens/ExchangeScreen"
import {AppStackNavigator} from "./AppStackNavigator"

export const AppTabNavigator = createBottomTabNavigator({
  Home: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 35, height: 35 }}
          source={require('../assets/home.png')}
        />
      ),
      tabBarLabel: 'Home Screen',
    },
  },
  Exchange: {
    screen: ExchangeScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 30, height: 30 }}
          source={require('../assets/exchange.png')}
        />
      ),
      tabBarLabel: 'Exchange',
    },
  },
});