import * as React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import SideDrawerMenu from './SideBarMenu';
import Settings from '../Screens/Settings';
import MyBarters from '../Screens/MyBarters';
import Notifications from '../Screens/Notifications';
import Received from "../Screens/Received"

export const DrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    Settings: { screen: Settings },
    Barters: { screen: MyBarters },
    Notifications: { screen: Notifications },
    Received: { screen: Received },
  },
  { contentComponent: SideDrawerMenu },
  { initialRouteName: 'Home' }
);
