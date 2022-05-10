import axios from 'axios'
import { setSuccess, setWarning, setError } from 'functions/setReply'

export const fetchOptions = {
  headers: {
    accepts: {
      json: {
        "Accept": "application/json",
        "Content-Type": "application/json"  
      }
    }
  }  
}

export async function baseFetch(method, url, data = {}, accepts = {}) {
  try {
    const headers = {    
      ...accepts,
      "Access-Control-Allow-Origin": "*"
    }

    const requestResult = await axios({ method, url, data, headers })   

    return requestResult.data
  } catch (error) {
    return setError(error.message)
  }  
}