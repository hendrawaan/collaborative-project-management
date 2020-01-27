import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import ProjectContent from '../../components/content/project/Project'
import FAB from '../../components/layout/FAB';
YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
const listFab = [{
  'key': '1',
  "title": "Add Project",
  "icon": "plus",
  'action': 'AddProject'
}]
export default class MyProjectScreen extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    return (
      <View style={{ backgroundColor: '#fafbfc', flex: 1 }}>
        <ProjectContent navigation={this.props.navigation} />
      </View>
    );
  }
}
const styles = StyleSheet.create({

})