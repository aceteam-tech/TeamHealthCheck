import Amplify, { Auth } from 'aws-amplify'
import { CLIENT_ID, USER_POOL_ID } from 'babel-dotenv'
import appStore from '../../../model/app.store'
import socketStore from './socket.store'

Amplify.configure({
    Auth: {
        region: 'eu-west-2',
        userPoolId: USER_POOL_ID,
        userPoolWebClientId: CLIENT_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    },
    Storage: {
        bucket: 'squad-health-check',
        region: 'us-east-1'
    }
})

export const signUp = (email, password, name) => appStore.apiRequestCalled(Auth.signUp({
    username: email,
    password,
    attributes: {
        name
    }
}))

export const verify = (username, code) => appStore.apiRequestCalled(Auth.confirmSignUp(username, code))

export const resendCode = (username) => appStore.apiRequestCalled(Auth.resendSignUp(username))

export const login = (username, password) => appStore.apiRequestCalled(Auth.signIn(username, password), ['UserNotConfirmedException'])

export const forgotPassword = username => appStore.apiRequestCalled(Auth.forgotPassword(username))

export const forgotPasswordSubmit = (username, code, newPassword) => appStore.apiRequestCalled(Auth.forgotPasswordSubmit(username, code, newPassword))

export const getSession = async () => Auth.currentSession()

export const getUser = async () => Auth.currentAuthenticatedUser()

export const signOut = () => {
    socketStore.logout()
    appStore.apiRequestCalled(Auth.signOut())
}
