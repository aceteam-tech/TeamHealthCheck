import { WEBSOCKET_URL } from 'babel-dotenv'
import { getSession } from './auth'
import handleSocketCallback from '../socket-handlers'

export function initSocketConnection() {
    return getSession().then(session => {
        const token = session.getIdToken().getJwtToken()
        const ws = new WebSocket(`${WEBSOCKET_URL}?Authorization=${token}`)

        return new Promise((resolve, reject) => {
            ws.onopen = () => {
                console.log('Connection opened!')
                resolve(ws)
            }

            ws.onmessage = (message) => {
                const data = JSON.parse(message.data)
                console.log({'data': data})
                handleSocketCallback(data)
            }

            ws.onerror = (e) => {
                // an error occurred
                console.log('error in connection man')
                console.log(e.message)
                reject(ws)
            }

            ws.onclose = () => {
                console.log('closed. Reconnecting...')
                initSocketConnection()
            }
        })
    })
}
