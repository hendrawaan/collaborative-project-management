import React from 'react';
import {  Container, Content} from 'native-base';
import { YellowBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
const name ='Dashboard';
export default class NotificationScreen extends React.Component {
  render() {
    return (
      <Container>
        <Content padder style={{ backgroundColor: '#fafbfc' }}>
          <ScrollView >

          </ScrollView>
        </Content>
      </Container>
    );
  }
}