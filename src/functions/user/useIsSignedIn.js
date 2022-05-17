import React, { useEffect, useContext } from 'react'
import { setScuess, setWarning, setError } from 'functions/setReply'
import { GlobalStateContext } from 'state/globalState'
import { useActor } from '@xstate/react'
import { getLocalStorage } from 'functions/localStorage'

function useIsSignedIn() {
  const globalServices = useContext(GlobalStateContext)  
  const { send } = globalServices.authService
  const [ state  ] = useActor(globalServices.authService)  

  useEffect(() => {
    if (state.value !== 'finish') {
      const getTokenResult = getLocalStorage('token')

      send('SIGN_IN', { token: getTokenResult.value })
    }
  }, [])

  if (state.value === 'finished') {
    return state.context.userInfo.status === 'ok'
  }
}

export default useIsSignedIn