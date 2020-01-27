import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, StatusBar } from 'react-native';
import { Left, Right, Text, CardItem, Content, Item, Input, Badge, Tab, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/Feather'
import FAB from '../../layout/FAB'
import AsyncStorage from '@react-native-community/async-storage';
import { createApolloFetch } from 'apollo-fetch'
import LinearGradient from 'react-native-linear-gradient'
import Tab1 from './Division';
import Tab2 from './Employee'
import md5 from 'md5'
const leader_id = 'leader'
const leader_name = 'Leader of Organization'
export default class EmployeeContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      nilai: null,
      organization: '',
      user: '',
      dataBackup: [],
      isLeader: ''
    }
    this.push()
  }
  fetch = createApolloFetch({ uri: this.props.navigation.getParam('uri') });
  async push() {
    const retrievedOrganization = await AsyncStorage.getItem('organization');
    const retrievedItem = await AsyncStorage.getItem('leader');
    const item = JSON.parse(retrievedItem);
    const itemOrganization = JSON.parse(retrievedOrganization);
    this.setState({ organization: itemOrganization, isLeader: item })
    var organization = this.state.organization
    this.fetch({
      query: `{
      organization(_id:"`+ organization + `") {
        leader {
          leader { _id, name, email, contact
            project { code, name, status,
              module { requirement { status } }
            },
            collaborator {
              project {
                code, name, status,
                employee { name },
                module { requirement { status } }
              },
              status
            }
          }
        }
        division { _id, name,
          employee { _id, name, email, contact,
            project { code, name, status,
              module { requirement { status } }
            },
            collaborator { status,
              project { code, name, status,
                module { requirement { status } }
              },
            }
          }
        }
      }
    }`}).then(response => {
        var data = []
        response.data.organization.leader.forEach(function (item_d) {
          var employee = []
          item_d.leader.forEach(function (item_e) {
            var data = []
            var l_proj = item_e.project
            var l_coll = item_e.collaborator.filter(function (filter) { return filter.status === '1' })
            l_coll.forEach(function (item) { data = data.concat(item.project) })
            data = data.concat(l_proj)
            employee.push({
              id: item_e._id,
              name: item_e.name,
              email: item_e.email,
              contact: item_e.contact,
              division_id: leader_id,
              division_name: leader_name,
              project: data.length,
              invitation: '-',
              data: data
            })
          })
          data.push({
            id: leader_id,
            name: leader_name,
            member: 1,
            employee: employee
          })
        })
        response.data.organization.division.forEach(function (item_d) {
          var employee = []
          item_d.employee.forEach(function (item_e) {
            var data = []
            var l_proj = item_e.project
            var l_coll = item_e.collaborator.filter(function (filter) { return filter.status === '1' })
            let l_wait = item_e.collaborator.filter(function (filter) { return filter.status === '0' })
            l_coll.forEach(function (item) { data = data.concat(item.project) })
            data = data.concat(l_proj)
            employee.push({
              id: item_e._id,
              name: item_e.name,
              email: item_e.email,
              contact: item_e.contact,
              division_id: item_d._id,
              division_name: item_d.name,
              project: data.length,
              invitation: l_wait.length,
              data: data
            })
          })
          data.push({
            id: item_d._id,
            name: item_d.name,
            member: item_d.employee.length,
            employee: employee
          })
        })
        this.setState({
          data: data,
          loading: false,
        })
      })
  }
  addDivision(name) {
    const { params } = this.props.navigation.state
    var id = params.RDS(32, 'aA')
    this.fetch({
      query: `
    mutation {
      division_add(
        _id:"`+ id + `",
        organization:"`+ this.state.organization + `",
        name:"`+ name + `"
      ){_id}
    }`
    })
    this.setState({
      data: [...this.state.data, {
        id: id, name: name, member: 0, employee: []
      }]
    })
  }
  updateDivision(id, name) {
    this.fetch({
      query: `
      mutation {
        division_edit(
          _id:"`+ id + `",
          name:"`+ name + `"
        ){_id}
      }`
    })
    let data = this.state.data
    data.forEach(function (item) {
      if (id === item.id) {
        item.name = name
      }
    })
    this.setState({ data: data })
  }
  deleteDivision(id) {
    this.fetch({
      query: `
      mutation {
        division_delete(_id:"`+ id + `"){_id}
      }`
    })
    let data = this.state.data.filter(function (item) { return (item.id !== id) })
    this.setState({ data: data })
  }
  addEmployee(division, name, email, contact) {
    const { params } = this.props.navigation.state
    var id = params.RDS(32, 'aA')
    this.fetch({
      query: `
      mutation {
        employee_add(
          _id:"`+ id + `",
          password:"`+ md5('1234') + `",
          organization:"`+ this.state.organization + `",
          division:"`+ division + `",
          name:"`+ name + `",
          email:"`+ email + `",
          contact:"`+ contact + `",
        ){_id}
      }`
    })
    let data = this.state.data
    data.forEach(function (item_d) {
      if (item_d.id === division) {
        item_d.member = item_d.member + 1
        item_d.employee = [...item_d.employee, {
          id: id,
          name: name,
          email: email,
          contact: contact,
          division_id: item_d.id,
          division_name: item_d.name,
          project: 0,
          invitation: 0,
          data: []
        }]
      }
    })
    this.setState({ data: data })
  }
  updateEmployee(id, oldDivision, newDivision) {
    this.fetch({
      query: `
    mutation {
      employee_edit(
        _id:"`+ id + `",
        division:"`+ newDivision + `"
      ){_id}
    }`
    })
    let temp = []
    let data = this.state.data
    data.forEach(function (item) {
      if (item.id === oldDivision) {
        item.member = item.member - 1
        temp = item.employee.filter(function (filter) { return filter.id === id })
        let employee = item.employee.filter(function (filter) { return filter.id !== id })
        item.employee = employee
      }
    })
    data.forEach(function (item) {
      if (item.id === newDivision) {
        item.member = item.member + 1
        temp[0]['id'] = temp[0]['id']
        temp[0]['division_id'] = item.id
        temp[0]['division_name'] = item.name
        item.employee = [...item.employee, temp[0]]
      }
    })
    this.setState({ data: data })
  }
  deleteEmployee(id) {
    this.fetch({
      query: `mutation{
      employee_delete(_id:"`+ id + `"){_id}
    }`})
    let data = this.state.data
    data.forEach(function (item_d) {
      item_d.employee.forEach(function (item_e) {
        if (item_e.id === id) {
          console.log(item_e)
          console.log(item_d.member)
          item_d.member = item_d.member - 1
          let employee = item_d.employee.filter(function (filter) { return filter.id !== id })
          item_d.employee = employee
        }
      })
    })
    this.setState({ data: data })
  }
  resetEmployee(id) {
    console.log(id)
    this.fetch({
      query: `
    mutation {
      employee_edit(
        _id:"`+ id + `",
        password:"`+ md5('1234') + `"
      ){_id}
    }`
    })
  }
  _tabUsers() {
    const { navigation } = this.props
    const { data } = this.state
    return (
      <View style={styles.CardTab}>
        <Tabs
          tabContainerStyle={{ maxHeight: 50, flex: 1, backgroundColor: 'transparent', elevation: 0 }}
          tabBarUnderlineStyle={{ backgroundColor: '#4c669f' }}>
          <Tab
            heading="Division"
            tabStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 40 }}
            textStyle={{ color: 'grey', fontSize: 12 }}
            activeTabStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 40 }}
            activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
            <Tab1
              navigation={navigation}
              data={data}
              leader={leader_id}
              header={this._header.bind(this)}
              update={this.updateDivision.bind(this)}
              delete={this.deleteDivision.bind(this)}
            />
          </Tab>
          <Tab
            heading="Employee"
            tabStyle={{ backgroundColor: '#fff' }}
            textStyle={{ color: 'grey', fontSize: 12 }}
            activeTabStyle={{ backgroundColor: '#fff' }}
            activeTextStyle={{ color: '#4c669f', fontWeight: 'normal', fontSize: 12 }}>
            <Tab2
              navigation={navigation}
              data={data}
              leader={leader_id}
              header={this._header.bind(this)}
              update={this.updateEmployee.bind(this)}
              reset={this.resetEmployee.bind(this)}
              delete={this.deleteEmployee.bind(this)} />
          </Tab>
        </Tabs>
      </View>
    )
  }
  _header(Title) {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={[styles.mainScreen, styles.upperScreen]}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
          <Icon name='chevron-left' style={[styles.font, { textAlign: 'left', fontSize: 35, elevation: 1, marginTop: 6, fontWeight: 'bold' }]} />
        </TouchableOpacity>
        <Text style={styles.title}>{Title}</Text>
      </LinearGradient>
    )
  }
  render() {
    const listFab = [{
      'key': '1',
      "title": "Add Division",
      "icon": "plus",
      'action': 'AddDivision',
      'id': this.state.organization,
      'uri': this.props.navigation.getParam('uri'),
      'function': this.addDivision.bind(this)
    }, {
      'key': '2',
      "title": "Add Employee",
      "icon": "plus",
      'action': 'AddEmployee',
      'id': this.state.organization,
      'uri': this.props.navigation.getParam('uri'),
      'function': this.addEmployee.bind(this)
    }]
    return (
      <View style={{ flex: 1 }}>
        {this._header('Users')}
        {this._tabUsers()}
        {this.state.isLeader === '1' &&
          <FAB
            listFab={listFab}
            navigation={this.props.navigation}
            header={this._header.bind(this)} />
        }

      </View>
    );
  }
}
const styles = StyleSheet.create({
  font: {
    color: 'white'
  },
  header: {
    flex: 1,
    resizeMode: 'cover',

  },
  CardMenu: {
    borderRadius: 4,
    height: 90
  },
  MenuIcon: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '100'
  },
  CardTab: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    flex: 1,
    backgroundColor: 'white',
    //marginTop: 40
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#0881a3',
  },
  upperScreen: {
    maxHeight: 50,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: '#000',
    shadowRadius: 2,
    borderColor: '#ddd',
    borderRadius: 2,
    flexDirection: 'row',
    height: 50
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});