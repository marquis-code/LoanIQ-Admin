import { ref } from "vue"
import { GATEWAY_ENDPOINT_WITH_AUTH } from "@/api_factory/axios.config"

const sessionInfoObj = ref({})

export const useFetchSessionInfo = () => {
  const fetchSessionInfo = async (bearerToken: string) => {
    try {
      console.log("Fetching session info with bearer token")

      const response = await GATEWAY_ENDPOINT_WITH_AUTH.get("/session/info", {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      })

      sessionInfoObj.value = response.data
      sessionStorage.setItem('sessionInfo', JSON.stringify(response?.data?.data))
      console.log("Session info fetched successfully:", response.data)
      return response.data.data
    } catch (error) {
      console.error("Error fetching session info:", error)
      throw error
    }
  }

  return {
    fetchSessionInfo,
    sessionInfoObj,
  }
}
