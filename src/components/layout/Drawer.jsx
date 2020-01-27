import PropTypes from 'prop-types';
import React from "react";
import { NavigationActions } from 'react-navigation';
import { AppRegistry, Image, StatusBar, TouchableOpacity, StyleSheet } from "react-native";
import { Container, Content, Text, ListItem, Accordion, Button, View } from "native-base";
import Feather from 'react-native-vector-icons/Feather';
class Drawer extends React.Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: data
        });
        this.props.navigation.dispatch(navigateAction);
    }
    state = {
        expanded: false
    }

    _handlePress = () =>
        this.setState({
            expanded: !this.state.expanded
        });

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.screenContainer} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                        <View style={[styles.screenStyle, (this.props.activeItemKey == 'Home') ? styles.activeBackgroundColor : null]} onPress={() => this.props.navigation.navigate('Home')}>
                            <Feather name="home" size={25} style={[styles.iconStyle, (this.props.activeItemKey == 'Home') ? styles.selectedTextStyle : null]}></Feather>
                            <Text style={[styles.screenTextStyle, (this.props.activeItemKey == 'Home') ? styles.selectedTextStyle : null]} >Home</Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 0.5,
                            marginTop: 10
                        }}
                    />
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Client')}>
                        <View style={[styles.screenStyle, (this.props.activeItemKey == 'Client') ? styles.activeBackgroundColor : null]} onPress={() => this.props.navigation.navigate('Client')}>
                            <Feather name="user-check" size={25} style={[styles.iconStyle, (this.props.activeItemKey == 'Client') ? styles.selectedTextStyle : null]}></Feather>
                            <Text style={[styles.screenTextStyle, (this.props.activeItemKey == 'Client') ? styles.selectedTextStyle : null]} >Client</Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}></TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: {
        paddingTop: 20,
        width: '100%',
    },
    screenStyle: {
        height: 30,
        marginVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        //justifyContent: 'space-between',
    },
    screenTextStyle: {
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'center',
        color: "#5f6769",
        alignSelf: "auto"
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: 'black'
    },
    activeBackgroundColor: {
        //backgroundColor: 'grey'
    },
    iconStyle: {
        marginLeft: 20,
        color: '#5f6769'
    },
    selectedIconStyle: {
        marginLeft: 20,
        color: 'black'
    }
});
Drawer.propTypes = {
    navigation: PropTypes.object
};

export default Drawer;