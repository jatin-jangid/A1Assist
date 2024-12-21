import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Header = (props: {title: string}) => {
  return (
    <View style={styles.headerView}>
      <Text style={styles.headerText}>{props.title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
    headerView:
  { 
    alignItems: "center", 
    flexDirection: "row", 
    height: 50,
    backgroundColor: 'rgb(255, 191, 28)',
  },
  headerText: {
    flex:1,
    margin: 10,
    opacity: 1,
    backgroundColor: 'transparent',
    fontStyle: 'normal',
    fontWeight: 'bold',
    includeFontPadding: false,
    padding: 0,
    // color: 'rgb(250, 244, 223)',
    color: 'rgb(0, 0, 0)',
    textAlign: 'center',
    fontSize: 28,
  }
})
