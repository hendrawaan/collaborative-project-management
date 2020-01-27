import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Text, Content, Item, Input, Form, Button, Textarea, Toast, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import { createApolloFetch } from 'apollo-fetch'
import { StackActions } from 'react-navigation';
export default class AddRequirementContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataBackup: [],
            requirementName: '',
            detailRequirement: '',
            moduleList: '',
            label: ''
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    push() {
        this.fetch({
            query: `{
            project(_id:"`+ this.props.navigation.getParam('id') + `") {
              module {
                _id,
                name,
                detail,
              }
            }
          }`
        }).then(result => {
            var data = []
            var temp = result.data.project.module
            temp.forEach(function (item_m) {
                data.push({
                    id: item_m._id,
                    name: item_m.name,
                    detail: item_m.detail,
                })
            })
            this.setState({
                data: data,
            })
        })
    }
    pickerChange(index) {
        const { data } = this.state
        data.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: data[index].name,
                    moduleList: data[index].id + '_' + data[index].name
                })
            }
        })

    }
    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    insert_replace(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '\\n')
    }
    requirementValidation() {
        const { detailRequirement, requirementName, moduleList, label } = this.state
        if (detailRequirement === '' || requirementName === '' || moduleList === '') {
            Toast.show({
                text: 'Form cannot be empty',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'yellow' }
            })
        } else {
            return true
        }
    }
    requirementSave() {
        const { detailRequirement, requirementName, moduleList } = this.state
        const { params } = this.props.navigation.state
        if (this.requirementValidation() === true) {
            params.function(moduleList, requirementName, detailRequirement)
            Toast.show({
                text: 'Requirement added',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'green' }
            })
            this.props.navigation.dispatch(StackActions.popToTop());
        }
    }
    _content() {
        const { detailRequirement, requirementName, moduleList, data } = this.state
        return (
            <Content style={{ marginHorizontal: 20 }}>
                <Text style={styles.Subtitle}>Module</Text>
                <Item style={styles.Input} picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={moduleList}
                        onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                    >
                        {
                            data.map((v, index) => {
                                return <Picker.Item label={v.name} value={v.id + '_' + v.name} key={index} />
                            })
                        }
                    </Picker>
                </Item>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ requirementName: text })}
                        value={requirementName} />
                </Item>
                <Text style={styles.Subtitle}>Detail</Text>
                <Form style={[styles.Input, { height: 200 }]} regular >
                    <Content>
                        <Textarea
                            style={{ borderWidth: 0 }}
                            rowSpan={10}
                            placeholderTextColor='grey'
                            onChangeText={(text) => this.setState({ detailRequirement: text })}
                            value={detailRequirement}
                            multiline={true} />
                    </Content>
                </Form>

                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => this.requirementSave()}>
                    <Text style={{ textAlign: 'center' }}>Add</Text>
                </Button>
            </Content>
        )
    }
    render() {
        const { params } = this.props.navigation.state
        return (
            <View style={{ flex: 1 }}>
                {params.header("Add Requirement")}
                {this._content()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    font: {
        color: 'white'
    },
    Input: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        borderRadius: 4,
        borderColor: '#E8E8E8'
    },
    Subtitle: {
        color: '#A9A9A9',
        marginTop: 30
    },
});