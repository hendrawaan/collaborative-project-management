import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Button } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import HomeContent from '../../components/content/home/Home'
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamd',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
const name = 'Dashboard';
export default class HomeScreen extends React.Component {
  render() {
    return (
      <Container style={{backgroundColor:'#fafbfc'}}>
        <HomeContent navigation={this.props.navigation} />
      </Container>
    );

  }
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}