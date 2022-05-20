import { setSuccess, setWarning, setError } from "functions/setReply"
import { fetchOptions, baseFetch } from "functions/baseFetch"
import config from 'config'

async function getUserWithToken(token) {  
  try {
    const url = config.api.urls.user.verifyToken
    const data = {token, includeUserData: true}
    const accepts = fetchOptions.headers.accepts.json

    const getUserResult = await baseFetch('POST', url, data, accepts)
    
    return getUserResult
  } catch (error) {
    return setError(error)
  }
}

export default getUserWithToken