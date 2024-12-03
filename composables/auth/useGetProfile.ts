import { auth_api } from '@/api_factory/modules/auth'
import { useUser } from '@/composables/auth/user'

export const useFetchProfile = () => {
    const { updateUserData } = useUser()
    const loading = ref(false);
    const profileObj = ref({} as any);
    const { $_get_profile } = auth_api;
    const getProfileInfo = async () => {
        loading.value = true;
        const res = await $_get_profile() as any;
        if (res.status == 201 || res.status == 200) {
            updateUserData(res?.data?.data)
            profileObj.value = res?.data.data
        }
        loading.value = false
    };

    onMounted(() => {
        getProfileInfo()
    })

    return {
        getProfileInfo,
        loading,
        profileObj
    };
};
