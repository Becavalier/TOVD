import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Icon from '../components/Icon';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    About: AboutScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Notes',
  tabBarIcon: ({ focused }) => (
    <Icon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-albums'
          : 'md-albums'
      }
    />
  ),
};
HomeStack.path = '';

const AboutStack = createStackNavigator(
  {
    Links: AboutScreen,
  },
  config
);

AboutStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <Icon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
  ),
};
AboutStack.path = '';


const tabNavigator = createBottomTabNavigator({
  HomeStack,
  AboutStack,
});

tabNavigator.path = '';

export default tabNavigator;
