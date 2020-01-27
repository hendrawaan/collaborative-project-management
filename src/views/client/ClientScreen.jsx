import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Container, Content, Button, } from 'native-base';
import { YellowBox, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ContentClient from '../../components/content/client/Client'

import Icon from 'react-native-vector-icons/Feather'
export default class ClientScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hide: false
    }
  }
  UNSAFE_componentWillUnmount() {
    StatusBar.setHidden(false)
  }
  render() {
    return (
      <ContentClient navigation={this.props.navigation} />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#0881a3',
  },
  upperScreen: {
    maxHeight: 120,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: '#000',
    shadowRadius: 2,
    borderColor: '#ddd',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  center: {
    flex: 1,
    alignItems: 'center',
  },
  font: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  form: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  bgimage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '50%',
  },
  CircleShapeView: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: '#ECECEC',
    marginTop: 20,
    opacity: 0.4,
    marginHorizontal: 10,

  },
});
