import { GATEWAY_ENDPOINT } from '../axios.config'

export const session_api = {
	$_get_session_info: () => {
	    const url = '/session/info'
		return GATEWAY_ENDPOINT.get(url)
	},
    $_establish_session: (payload: any) => {
        const url = '/session/establish'
		return GATEWAY_ENDPOINT.post(url, payload)
	}
}


