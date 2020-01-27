import React from 'react';
import { Container, Content, Tab, Tabs } from 'native-base';
import { YellowBox, View } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillReceiveProps has been renamed',
]);
export default class TabLayout extends React.Component {
  render() {
    return (
      <Tabs
      tabContainerStyle={this.props.tabContainerStyle}
      tabBarUnderlineStyle={this.props.tabBarUnderlineStyle}
      >
        {this.props.data.map((datas,index) =>
          <Tab heading={datas.name} key={index}>
            {this.props.tab}
          </Tab>
        )}
      </Tabs>
    );
  }
}
