import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileContent from '../../components/content/profile/Profile'
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
const name = 'Dashboard';
export default class ProfileScreen extends React.Component {
  render() {
    return (
      <ProfileContent navigation={this.props.navigation} />
    );
  }
}