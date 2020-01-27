import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Feather';

const listFab = [{
    'key': '1',
    "title": "Add Project",
    "icon": "plus",
    'action': 'AddProject'
}]

export default class FAB extends Component {

    render() {
        return (
            <ActionButton buttonColor="#4c669f" style={{ alignSelf: 'flex-end' }}>
                {this.props.listFab.map((listfabs, i) =>
                    <ActionButton.Item key={i} buttonColor='#ffffff' textStyle={{ color: '#4c669f' }} title={listfabs.title}
                        onPress={() => this.props.navigation.navigate(listfabs.action, {
                            header: this.props.header.bind(this),
                            id: listfabs.id,
                            uri: listfabs.uri,
                            function: listfabs.function.bind(this)
                        })}>
                        <Icon name={listfabs.icon} key={listfabs.key} style={styles.actionButtonIcon} />
                    </ActionButton.Item>)}
            </ActionButton>
        );
    }

}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: '#4c669f',
    },
});