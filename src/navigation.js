import React from 'react';
import {
  DrawerNavigator,
  StackNavigator,
  SwitchNavigator,
  TabNavigator
} from 'react-navigation';

import InitialLoadingScreen from './screens/InitialLoadingScreen';
import SettingsScreen from './screens/SettingsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MainScreen from './screens/MainScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import AboutScreen from './screens/AboutScreen';
import SideBar from './components/Sidebar';

const MainStack = DrawerNavigator(
  {
    Main: { screen: MainScreen },
    Settings: { screen: SettingsScreen },
    Payments: { screen: PaymentsScreen },
    About: { screen: AboutScreen }
  },
  {
    contentComponent: SideBar
  }
);

const KeySetupStack = StackNavigator(
  {
    Welcome: { screen: WelcomeScreen }
  },
  {
    initialRouteName: 'Welcome',
    mode: 'modal',
    headerMode: 'none'
  }
);

const RootStack = SwitchNavigator(
  {
    InitialLoading: InitialLoadingScreen,
    Main: MainStack,
    KeySetup: KeySetupStack
  },
  {
    initialRouteName: 'InitialLoading'
  }
);

export default RootStack;
