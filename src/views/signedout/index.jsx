import { createStackNavigator } from 'react-navigation-stack';
import SignIn from './Login';
import SignUp from './SignUp'

const Auth = createStackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            header: null
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },
});

export default Auth;