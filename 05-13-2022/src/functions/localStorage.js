import { ConfirmationNumber } from '@mui/icons-material'
import config from 'config'
import { setSuccess, setWarning, setError } from 'functions/setReply'

export function setLocalStorage(key, value, setExpirationTime = null) {
  if (config.localStorageType === 'cookie') {
    return setCookie(key, value, setExpirationTime)
  }
}

export function getLocalStorage(name) {
  if (config.localStorageType === 'cookie') {
    return getCookie(key, value)
  }
}

function setCookie(key, value, setExpirationTime) {
  try {        
    let expires = ''
    if (setExpirationTime === true) {
      let date = new Date();
      date.setTime(date.getTime() + (cookieExpiresIn * 24 * 60 * 60 * 1000));
      expires = "expires=" + date.toUTCString();
    }
    
    document.cookie = key + "=" + value + "; " + expires + "; path=/";    
  
    let data = {
      key,
      value
    }

    return setSuccess(data)
  } catch (error) {
    return setError(error)
  }
}

function getCookie(key, value) {
  try {
    key += "="
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded .split('; ');
    let res = ''
    
    if (cArr) {
      cArr.forEach(val => {
          if (val.indexOf(key) === 0) res = val.substring(name.length);
      })      
    }

    key = key.slice(-1)

    const data = {
      key,
      value: res
    }

    return setSuccess(data)
  } catch (error) {
    return setError(error)
  }
}