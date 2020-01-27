import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import ScrumContent from '../../components/content/project/Scrum'
YellowBox.ignoreWarnings([
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps has been renamed',
]);
export default class EditProjectScreen extends React.Component {

    render() {
        return (
                <ScrumContent navigation={this.props.navigation} />
        );
    }
}
