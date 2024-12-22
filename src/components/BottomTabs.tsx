import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image, Text, StyleSheet} from 'react-native';
import List from './List';

const Tab = createBottomTabNavigator();

const getIcon = (name: string, focused: boolean) => {
  switch (name) {
    case 'Wash':
      return focused
        ? require('../../assets/wash.png')
        : require('../../assets/wash-outlined.png');
    case 'Press':
      return focused
        ? require('../../assets/iron.png')
        : require('../../assets/iron-outlined.png');
    case 'Roll':
      return focused
        ? require('../../assets/roll.png')
        : require('../../assets/roll-outlined.png');
    default:
      return require('../../assets/wash-outlined.png');
  }
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          const icon = getIcon(route.name, focused);
          return (
            <View>
              <Image style={styles.tabIcon} source={icon} />
              {focused && <View style={styles.extraView} />}
            </View>
          );
        },
        tabBarLabelStyle: styles.iconText,
        tabBarStyle: styles.tabbarStyle,
      })}>
      <Tab.Screen
        name="Wash"
        component={List}
        options={{headerShown: false}}
        initialParams={{fromScreen : 'Wash', buttonColor: '#00becc', rates: 12}}
      />
      <Tab.Screen
        name="Press"
        component={List}
        options={{headerShown: false}}
        initialParams={{fromScreen : 'Press', buttonColor: '#00cc88', rates: 4}}
      />
      <Tab.Screen
        name="Roll"
        component={List}
        options={{headerShown: false}}
        initialParams={{fromScreen : 'Roll', buttonColor: '#rgb(255, 191, 28)', rates: 20}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 70,
    height: 20,
    resizeMode: 'contain',
    marginTop: 20,
    zIndex: 1,
  },
  iconText: {
    width: 70,
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    // marginBottom: 10,
    marginTop: 10,
    zIndex: 1,
  },
  tabbarStyle: {
    flex: 1,
    height: 80,
    backgroundColor: 'rgb(250, 244, 223)',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 40,
    borderTopWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
    marginLeft: '5%',
  },
  extraView: {
    position: 'absolute',
    height: 68,
    width: 105,
    borderRadius: 40,
    backgroundColor: 'rgb(255, 191, 28)',
    alignSelf: 'center',
    marginTop: 6.5,
  },
});
