import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import UsersContent from '../../components/content/users/Users';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class UsersScreen extends React.Component {
  render() {
    return (
      <UsersContent
        navigation={this.props.navigation} />
    );
  }
}