import React, { useEffect, useContext } from 'react'
import { setScuess, setWarning, setError } from 'functions/setReply'
import { GlobalStateContext } from 'state/globalState'
import { useActor } from '@xstate/react'
import { getLocalStorage } from 'functions/localStorage'
import { stateValuesEqual } from 'xstate/lib/State'

function useGetUserInfo() {
  const globalServices = useContext(GlobalStateContext)  
  const { send } = globalServices.authService
  const [ state  ] = useActor(globalServices.authService)
  
  useEffect(() => {    
      if (state.context.userInfo.status !== 'ok') {
        const getTokenResult = getLocalStorage('token')
        const token = getTokenResult.status === 'ok' ? getTokenResult.value : ''      
        if (token) {
          send('SIGN_IN', { requestType: 'signInWithToken', token })
        } else {
          send('FAIL')
        }
      }
  }, [])

  return {
    inProgress: state.context.inProgress,
    completed: state.value === 'finished',
    success: !state.context.inProgress && state.context.userInfo.status !== '' & state.context.userInfo.status === 'ok',
    status: state.context.userInfo.status,
    token: state.context.userInfo.token || undefined,
    user: state.context.userInfo.user
  }      
}

export default useGetUserInfo