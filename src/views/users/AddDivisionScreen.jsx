import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AddDivisionContent from '../../components/content/users/AddDivision';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class AddDivisionScreen extends React.Component {
  render() {
    return (
      <AddDivisionContent
        navigation={this.props.navigation} />
    );
  }
}