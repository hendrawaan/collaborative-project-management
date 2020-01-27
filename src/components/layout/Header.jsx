import React from "react";
import { Header, Left, Right, Body } from "native-base";
export default class HeaderNoShadow extends React.Component {
    render() {
        return (
            <Header noShadow style={this.props.style}>
                {this.props.visible === true &&
                    <Left>
                        {this.props.left}
                    </Left>}
                <Body>
                    {this.props.body}
                </Body>
                <Right>
                    {this.props.right}
                </Right>
            </Header>
        );
    }
}