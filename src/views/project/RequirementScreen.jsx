import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import RequirementContent from '../../components/content/project/Requirement'
YellowBox.ignoreWarnings([
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps has been renamed',
]);
export default class RequirementScreen extends React.Component {

    render() {
        return (
                <RequirementContent navigation={this.props.navigation} />
        );
    }
}
