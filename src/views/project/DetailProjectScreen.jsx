import React from 'react';
import { YellowBox, StyleSheet } from 'react-native';
import DetailProjectContent from '../../components/content/project/DetailProject';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class DetailProjectScreen extends React.Component {

  render() {
    const { navigation } = this.props
    return (
      <DetailProjectContent
        navigation={navigation} />
    );
  }
}
const styles = StyleSheet.create({

});