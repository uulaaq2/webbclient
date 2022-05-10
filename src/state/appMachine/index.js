import { createContext } from 'react'
import { createMachine, assign, send } from 'xstate'
import { getUser } from 'functions/user/getUser'
import { setSuccess, setWarning, setError } from 'functions/setReply'
import { areArraysEqual } from '@mui/base'

// app global context
export const AppMachineContext = createContext()

// app machine to prepare the global app context
export const appMachine = createMachine({
  id: 'app',
  initial: 'init',
  context: {
    user: undefined,
    reply: undefined
  },

  states: {
    init: {},

    auth: {
      states: {
        validating: {
          invoke: {
            id: 'validateUser',
            src: doGetUser,
            onDone: [
              {
                target: 'storingToken',
                cond: (context, event) => event.data.status === 'ok'
              },
              {
                target: 'failed'
              }
            ],
            onError: {

            }          
          }
        
        // validate
        },
        storingToken: {
          invoke: {
            src: (context, event) => console.log(event)
          }
          
        // store token  
        },
        success: {
          invoke: {
            src: (context, event) => console.log('success ', event)
          }          
        // success  
        },
        failed: {
          id: 'failed',
          invoke: {
            src: (contex, event) => console.log('failed ', event)
          }
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
    },

    STORE_TOKEN: {
      target: 'auth.storingToken'
    }
  }
 
})

// call getUser function
async function doGetUser(_, event) {  
  try {
    const email = event.email
    const password = event.password
  
    const getUserResult = await getUser(email, password)    

    return getUserResult
  } catch (error) {
    return setError(error)   
  }
}