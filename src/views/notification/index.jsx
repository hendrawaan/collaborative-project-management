import { createStackNavigator } from 'react-navigation-stack';
import NotificationScreen from './NotificationScreen'

const NotificationStack = createStackNavigator({
    Notification: {
        screen: NotificationScreen,
        navigationOptions: {
            header: null,
            drawerLockMode: 'locked-closed'

        }
    }
});

export default NotificationStack;