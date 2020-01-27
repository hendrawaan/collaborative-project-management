import React from 'react';
import { StyleSheet } from 'react-native';
import {
    Layout,
    Select,
} from 'react-native-ui-kitten';
data = []
export default class SelectSimpleUsageShowcase extends React.Component {
    constructor() {
        super()

    }
    state = {
        selectedOption: null,
    };

    onSelect = (selectedOption) => {
        this.setState({ selectedOption });
    };

    render() {
        return (
            <Layout>
                <Select
                    style={styles.select}
                    data={this.props.data}
                    placeholder={this.props.placeholder}
                    selectedOption={this.props.selectedOption}
                    onSelect={this.props.onSelect}
                />
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 230,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    select: {
        flex: 1,
        marginHorizontal: 4,
    },
});