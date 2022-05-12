import { createContext } from 'react'
import { createMachine, assign, send, actions } from 'xstate'
import getUser from 'functions/user/getUser'
import { setSuccess, setWarning, setError } from 'functions/setReply'
import { setLocalStorage } from 'functions/localStorage'
import { ConstructionOutlined } from '@mui/icons-material'

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
        gettingUser: {
          entry: assign({ inProgress: true}),
          exit:  assign({ userInfo: (context, event) => event.data }),
          invoke: {
            id: 'getUser',   
            src: doGetUser,                        
            onDone: [       
              {     
                target: 'storingToken',
                cond: (context, event) => event.data.status === 'ok'
              },
              {     
                target: 'accountIsExpired',
                cond: (context, event) => event.data.status === 'accountIsExpired'
              },     
              {     
                target: 'shouldChangePassword',
                cond: (context, event) => event.data.status === 'shouldChangePassword'
              },                         
              {     
                target: 'warning',
                cond: (context, event) => event.data.status === 'warning'
              },     
              {     
                target: 'error',
                cond: (context, event) => event.data.status === 'error'
              },                                      
              {
                target: 'failed'
              }
            ],
            onError: {
              target: 'failed'
            }          
          }        
        // gettingUser
        },
        storingToken: {
          entry: assign({ inProgress: true}),
          invoke: {
            id: 'storeToken',   
            src: doStoreToken,            
            onDone: [
              {     
                target: 'success',
                actions: () => console.log('b'),
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
        // storingToken
        },
        success: {
          type: 'final'
        // success  
        },
        accountIsExpired : {
          entry: assign({ inProgress: false}),
          type: 'final'
        // accountIsExpired
        },
        shouldChangePassword: {
          entry: assign({ inProgress: false}),
          type: 'final'
        // shouldChangePassword
        },
        warning : {
          entry: assign({ inProgress: false}),
          type: 'final'
        // warning
        },
        error: {
          entry: assign({ inProgress: false}),
          type: 'final'
        // error
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
      target: 'auth.gettingUser'
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
    console.log('aaa')
    let rememberMe = event.data.clientRememberMe && event.data.user.Can_Be_Remembered
    
    return setLocalStorage('token', event.data.token, rememberMe)
  } catch (error) {

    return setError(error)
  }
}