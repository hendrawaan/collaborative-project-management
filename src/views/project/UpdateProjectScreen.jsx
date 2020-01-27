import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import UpdateProjectContent from '../../components/content/project/UpdateProject'
YellowBox.ignoreWarnings([
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps has been renamed',
]);
export default class EditProjectScreen extends React.Component {

    render() {
        return (
            <UpdateProjectContent navigation={this.props.navigation} />
        );
    }
}
const styles = StyleSheet.create({

})