import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Feather';
import Drawer from '../components/layout/Drawer';
import HomeStack from '../views/home/index.jsx';
import ProjectStack from '../views/project/index';
import NotificationStack from '../views/notification/index';
import ProfileStack from '../views/profile/index';
import ClientStack from '../views/client/index';
import SignedOut from '../views/signedout/index';
import AuthloadingScreen from './auth';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from 'react';
const MainTabs = createBottomTabNavigator(
    {
        Home: { screen: HomeStack },
        Project: { screen: ProjectStack, },
        Notification: { screen: NotificationStack },
        Profile: { screen: ProfileStack },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = Icon;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `home`;
                } else if (routeName === 'Project') {
                    iconName = 'box';
                } else if (routeName === 'Notification') {
                    iconName = 'bell';
                } else if (routeName === 'Profile') {
                    iconName = 'user';
                }
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#2b3137',
            inactiveTintColor: 'grey',
        },
    }
);
MainTabs.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};
const MainDrawer = createDrawerNavigator({
    Dashboard: {
        screen: MainTabs,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: ({ tintColor }) => <Icon name="home" size={17} />,
        }
    },
    Client: {
        screen: ClientStack,
        navigationOptions: {
            drawerLabel: 'Client',
            drawerIcon: ({ tintColor }) => <Icon name="home" size={17} />,

        }
    }
}, {
    contentComponent: Drawer
},
    {
        initialRouteName: 'Home',
    });
MainTabs.navigationOptions = ({ navigation }) => {
    var name = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
    let drawerLockMode = 'locked-closed'
    if (name.routeName == 'Home' || name.routeName == 'Client') {
        drawerLockMode = 'unlocked'
    }
    return {
        drawerLockMode,
    };
}

export default createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: {
                screen: AuthloadingScreen
            },
            App: {
                screen: HomeStack
            },
            Auth: {
                screen: SignedOut
            }
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);
//export default createAppContainer(App);