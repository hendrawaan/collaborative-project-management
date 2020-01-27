import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DetailDivisionContent from '../../components/content/users/DetailDivision';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class DetailDivisionScreen extends React.Component {
  render() {
    return (
      <DetailDivisionContent
        navigation={this.props.navigation} />
    );
  }
}