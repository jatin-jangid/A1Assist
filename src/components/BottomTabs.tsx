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
// headerColor options : #fff0ad
const headerColor = '#fff09a'
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
        unmountOnBlur: true,
      })}>
      <Tab.Screen
        name="Wash"
        component={List}
        options={{headerShown: false}}
        initialParams={{
          fromScreen: 'Wash',
          buttonColor: '#00becc',
          rates: 12,
          listBackgroundColor: '#c6fbff',
          quantityContainerBackgroundColor: '#27f1ff',
          headerColor: headerColor,
        }}
      />
      <Tab.Screen
        name="Press"
        component={List}
        options={{headerShown: false}}
        initialParams={{
          fromScreen: 'Press',
          buttonColor: '#00cc88',
          rates: 4,
          listBackgroundColor: '#c1ffea',
          quantityContainerBackgroundColor: '#4fffc4',
          headerColor: headerColor,
        }}
      />
      <Tab.Screen
        name="Roll"
        component={List}
        options={{headerShown: false}}
        initialParams={{
          fromScreen: 'Roll',
          buttonColor: '#rgb(255, 191, 28)',
          rates: 20,
          listBackgroundColor: 'rgb(253, 238, 169)',
          quantityContainerBackgroundColor: 'rgb(255, 191, 28)',
          headerColor: headerColor,
        }}
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
    left: 10,
    right: 10,
    borderRadius: 40,
    borderTopWidth: 0,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    width: '95%',
    marginLeft: '2.5%',
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
