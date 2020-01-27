import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DetailEmployeeContent from '../../components/content/users/DetailEmployee';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class DetailEmployeeScreen extends React.Component {
  render() {
    return (
      <DetailEmployeeContent
        navigation={this.props.navigation} />
    );
  }
}