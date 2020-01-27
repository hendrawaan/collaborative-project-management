import { createStackNavigator } from 'react-navigation-stack';
import ProfileScreen from './ProfileScreen'

const ProfileStack = createStackNavigator({
   Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            header: null
        }
    }
});

export default ProfileStack;