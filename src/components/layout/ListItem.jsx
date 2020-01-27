import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
export default class ListAvatarExample extends Component {
    render() {
        return (
            <List>
                <ListItem>
                    {this.props.Left}
                    {this.props.Body}
                    {this.props.Right}
                </ListItem>
            </List>
        );
    }
}