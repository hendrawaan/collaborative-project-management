import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs, Picker, Toast, Button } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import DatePicker from 'react-native-datepicker';
import { StackActions } from 'react-navigation';
const setting = [{ icon: 'edit-3', text: 'Edit Project' },
{ icon: 'play', text: 'Start Project' },
{ icon: 'trash', text: 'Delete Project' },
]
export default class EditProjectContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            nilai: null,
            organization: '',
            user: '',
            dataBackup: [],
            code: '',
            name: '',
            client: '',
            label: '',
            start: new Date(),
            end: new Date(),
            min: new Date(),
        }
        this.push()
    }
    fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
    editProjectValidation() {
        const { client, start, end, code, name } = this.state
        if (client === '' || start === '' || end === '' || code === '' || name === '') {
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
    pickerChange(index) {
        this.state.data.map((v, i) => {
            if (index === i) {
                this.setState({
                    label: this.state.data[index].label,
                    client: this.state.data[index].value
                })
            }
        })
    }
    editProject() {
        const { client, start, end, code, name } = this.state
        const { params } = this.props.navigation.state
        if (this.editProjectValidation() === true) {
            params.editProject(code, name, client, start, end)
            var activity_id = params.RDS(32, 'aA')
            var activity_code = 'P2'
            var project_id = this.props.navigation.getParam('_id')
            var activity_date = new Date()
            params.activityAdd(activity_id, project_id, activity_code, "", activity_date)
            Toast.show({
                text: 'Project Edited',
                buttonText: 'Undo',
                duration: 3000,
                textStyle: { color: 'green' }
            })
            this.props.navigation.dispatch(StackActions.popToTop());
        }
    }
    async push() {
        const { params } = this.props.navigation.state
        const retrievedOrganization = await AsyncStorage.getItem('organization')
        const itemOrganization = JSON.parse(retrievedOrganization);
        this.setState({ organization: itemOrganization })
        var organization = this.state.organization
        var temp = this.props.navigation.getParam('data')
        var code = ''
        var name = ''
        var start = ''
        var end = ''
        var client_id = ''
        var client_name = ''
        temp.forEach(function (item) {
            client_id = item.client_id
            client_name = item.client_name
            end = item.end
            start = item.start
            name = item.name
            code = item.code
        })
        this.setState({
            code: code,
            name: name,
            client: client_id,
            label: client_name,
            start: start,
            end: end,
        })
        this.fetch({
            query: `{
                organization(_id:"`+ organization + `") {
                  client {
                    _id,
                    name
                  }
                }
              }`
        }).then(response => {
            var temp = response.data.organization.client
            var data = []
            temp.forEach(function (item) {
                data.push({
                    value: item._id,
                    label: item.name
                })
            })
            this.setState({
                data: data
            })
        })
    }
    _content() {
        return (
            <Content style={[styles.form, { height: 400, marginHorizontal: 20 }]}>
                <Text style={styles.Subtitle}>Code</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ code: text })}
                        value={this.state.code}
                    />
                </Item>
                <Text style={styles.Subtitle}>Name</Text>
                <Item style={styles.Input} regular >
                    <Input
                        style={{ borderWidth: 0 }}
                        placeholderTextColor='grey'
                        onChangeText={(text) => this.setState({ name: text })}
                        value={this.state.name}
                    />
                </Item>
                <Text style={styles.Subtitle}>Client</Text>
                <Item style={styles.Input} picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.client}
                        onValueChange={(itemValue, itemIndex) => this.pickerChange(itemIndex)}
                    >
                        {
                            this.state.data.map((v) => {
                                return <Picker.Item label={v.label} value={v.value} key={v.value} />
                            })
                        }
                    </Picker>
                </Item>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.Subtitle}>Start Date</Text>
                        <DatePicker
                            style={[styles.Input, { marginRight: 10 }]}
                            date={this.state.start} //initial date from state
                            mode="date" //The enum of date, datetime and time
                            placeholder="select date"
                            //format="DD-MM-YYYY"
                            minDate={this.state.min}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ start: date }) }}
                        />
                    </View>
                    <View>
                        <Text style={styles.Subtitle}>End Date</Text>
                        <DatePicker
                            style={[styles.Input, { marginLeft: 0, marginRight: 0 }]}
                            date={this.state.end} //initial date from state
                            mode="date" //The enum of date, datetime and time
                            placeholder="select date"
                            //format="DD-MM-YYYY"
                            minDate={this.state.min}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ end: date }) }}
                        />
                    </View>
                </View>
                <Button info style={{ backgroundColor: '#4c669f', width: 70, alignSelf: 'center', marginVertical: 30, borderRadius: 4 }}
                    onPress={() => this.editProject()}>
                    <Text style={{ textAlign: 'center' }}>Save</Text>
                </Button>
            </Content>
        )
    }

    render() {
        const { params } = this.props.navigation.state
        return (
            <View style={{ flex: 1 }}>
                {params.header('Edit Project')}
                {this._content()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    font: {
        color: 'white'
    },
    form: {

        backgroundColor: 'transparent',
        marginVertical: 30,
        width: 350
    },
    Input: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        borderRadius: 4,
        borderColor: '#E8E8E8',
    },
    Subtitle: {
        color: '#A9A9A9',
        marginTop: 10
    },
    TextBox: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 4,
        borderColor: '#E8E8E8',
        height: 100
    }
});