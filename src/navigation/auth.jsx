import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View, Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
export default class AuthLoadingScreen extends React.Component {
  UNSAFE_componentWillMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const item = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(item ? 'App' : 'Auth');
  };

  render() {
    return (
      <View style={styles.mainbody}>

        <Image style={styles.image} source={require('../assets/image/splash.png')} />
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainbody: {
    marginTop: 30,
    marginHorizontal: 24,
    marginBottom: 70
  },
  image: {
    marginLeft: 25,
    marginTop: 40,
    width: 320,
    height: 290
  }
})