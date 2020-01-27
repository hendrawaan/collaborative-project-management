import React from 'react';
import { Container, Content } from 'native-base';
import { YellowBox } from 'react-native';

import AddProjectContent from '../../components/content/project/AddProject'
YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested',
]);
export default class AddProjectScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      data: []
    };
  }
  data = [
    { text: 'Option 1' },
    { text: 'Option 2' },
    { text: 'Option 3' },
    { text: 'Option 4' },
  ];

  onSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <Container>
        <AddProjectContent
          navigation={this.props.navigation} />
      </Container>
    );
  }
}