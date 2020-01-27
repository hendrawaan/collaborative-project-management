import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Left, Right, Icon, Card, CardItem } from 'native-base';

export default class CardView extends React.Component {
    render() {
        return (
            <Card style={{ borderRadius: 8 }}>
                {this.props.header}
                {this.props.body}
                {this.props.footer}

            </Card>
        );
    }
}