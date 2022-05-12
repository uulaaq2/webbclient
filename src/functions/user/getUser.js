import { setSuccess, setWarning, setError } from "functions/setReply"
import { fetchOptions, baseFetch } from "functions/baseFetch"
import config from 'config'

async function getUser(email, password) {  
  try {
    const url = config.api.urls.user.signIn
    const data = {email, password}
    const accepts = fetchOptions.headers.accepts.json

    const getUserResult = await baseFetch('POST', url, data, accepts)

    return getUserResult
  } catch (error) {
    return setError(error.message)
  }
}

export default getUser