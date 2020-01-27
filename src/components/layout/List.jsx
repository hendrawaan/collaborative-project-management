import React from 'react';
import View from 'react-native';
import { Text, Icon, Thumbnail } from 'native-base';

export default class List extends React.Component {
    render() {
        return (
            <View>
                <View style={{ alignItems: 'flex-start', top: -10, marginLeft: 10, marginBottom: -35, marginTop: 5 }}>
                    <Thumbnail square small source={{ uri: this.props.image }} />
                </View>
            </View>
        );
    }
}