import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import IssuesContent from '../../components/content/project/Issues'
YellowBox.ignoreWarnings([
    'Warning: componentWillMount has been renamed',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps has been renamed',
]);
export default class IssuesScreen extends React.Component {

    render() {
        return (
                <IssuesContent navigation={this.props.navigation} />
        );
    }
}
