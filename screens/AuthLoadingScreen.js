import React from 'react'
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native'
import { getUser } from '../services/connection/adapters/auth'
import { initSocketConnection } from '../services/connection/adapters/socket-api'
import userStore from '../model/user-store'

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props)
        this._bootstrapAsync()
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        try {
            const user = await getUser()
            userStore.setUser(user.attributes)
            await initSocketConnection()
            this.props.navigation.navigate('TeamsFlow')
        } catch (e) {
            this.props.navigation.navigate('AuthFlow')
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="light-content" />
            </View>
        )
    }
}
