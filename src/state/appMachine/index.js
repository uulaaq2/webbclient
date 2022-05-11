import { createContext } from 'react'
import { createMachine, assign, send, actions } from 'xstate'
import { getUser } from 'functions/user/getUser'
import { setSuccess, setWarning, setError } from 'functions/setReply'
import { setLocalStorage } from 'functions/localStorage'

// app global context
export const AppMachineContext = createContext()

// app machine to prepare the global app context
export const appMachine = createMachine({
  id: 'app',
  preserveActionOrder: true,
  initial: 'init',
  context: {
    userInfo: undefined,
    inProgress: false
  },

  states: {
    init: {},

    auth: {
      states: {
        validating: {
          entry: assign({ inProgress: true}),
          invoke: {
            id: 'validateUser',   
            src: doGetUser,            
            onDone: [
              {     
                target: 'storingToken',
                actions: assign({ userInfo: (context, event) => event.data }),
                cond: (context, event) => event.data.status === 'ok'
              },
              {
                target: 'failed'
              }
            ],
            onError: {
              target: 'failed'
            }          
          }        
        // validate
        },
        storingToken: {
          entry: assign({ inProgress: true}),
          invoke: {
            id: 'storeToken',   
            src: doStoreToken,            
            onDone: [
              {     
                target: 'success',
                cond: (context, event) => event.data.status === 'ok'
              },
              {
                target: 'failed'
              }
            ],
            onError: {
              target: 'failed'
            }          
          }        
        // store token  
        },
        success: {
          entry: assign({ inProgress: false}),
          type: 'final'
        // success  
        },
        failed: {          
          entry: assign({ inProgress: false}),
          type: 'final'
        // failed
        }
      // auth states
      } 
    // auth end   
    }

  // main state
  },

  on: {
    VALIDATE: {
      target: 'auth.validating'
    }
  } 

})

// call getUser function
async function doGetUser(context, event) {  
  try {
    const { email, password, rememberMe } = event

    const getUserResult = await getUser(email, password)    

    return {
      ...getUserResult,
      clientRememberMe: rememberMe
    }
  } catch (error) {
    return setError(error)   
  }
}

// set token Local storage
async function doStoreToken(context, event) {
  try {        
    let rememberMe = event.data.clientRememberMe && event.data.user.Can_Be_Remembered
    
    return setLocalStorage('token', event.data.token, rememberMe)
  } catch (error) {

    return setError(error)
  }
}