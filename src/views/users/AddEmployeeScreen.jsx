import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AddEmployeeContent from '../../components/content/users/AddEmployee';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class AddEmployeeScreen extends React.Component {
  render() {
    return (
      <AddEmployeeContent
        navigation={this.props.navigation} />
    );
  }
}