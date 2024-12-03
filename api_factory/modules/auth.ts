import { GATEWAY_ENDPOINT } from '../axios.config'

export const auth_api = {
	 $_forgot_password: (payload: any) => {
		const url = '/auth/forget-password'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_login: (credential: any) => {
		const url = '/auth/login'
		return GATEWAY_ENDPOINT.post(url, credential)
	},
	$_reset_password: (credential: any) => {
		const url = '/auth/create-new-password'
		return GATEWAY_ENDPOINT.post(url, credential)
	},
	$_change_default_password: (credential: any) => {
		const url = '/auth/change-password'
		return GATEWAY_ENDPOINT.post(url, credential)
	},
	$_get_profile: () => {
		let url = '/profile';
		return GATEWAY_ENDPOINT.get(url);
	  },
}
