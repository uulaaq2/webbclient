import React, { useState, useRef, useEffect, useContext } from 'react'

import logo from 'images/logo.png'
import config from 'config'
import pageInitial from 'functions/pageInitial'
import moduleStyle from 'pages/signIn/style.css'
import { validateInputFields } from 'functions/validateInputFields'
import FormError from 'baseComponents/Alerts/FormError'
import InputGroup from 'baseComponents/InputGroup'
import CheckBoxGroup from 'baseComponents/CheckboxGroup'

import { useNavigate } from 'react-router-dom'
import { Grid, Paper, Box, Button, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { GlobalStateContext } from 'state/globalState'
import { useActor } from '@xstate/react'

const SignIn = ({ urlInfo }) => {  
  pageInitial( {pageName: 'user.signIn'} )

  const globalServices = useContext(GlobalStateContext)  
//  const isLoggedIn = useSelector(globalServices.authService, loggedInSelector);
  const { send } = globalServices.authService
  const [ state  ] = useActor(globalServices.authService)  

  const emailRef = useRef()
  const passwordRef = useRef()
  const rememberMeRef = useRef()  
  const navigate = useNavigate()
  
  const [erroredInputs, setErroredInputs] = useState([])  
  const [inputs] = useState({
    email: {      
      label: 'Email or User name',
      type: 'text',
      errorText: '',
      ref: emailRef,
      required: true,
      validate: true
    },
    password: {
      label: 'Password',
      type: 'password',
      errorText: '',
      ref: passwordRef,
      required: true,
      validate: true
    },
    inputErors: 0,
    setErroredInputs: setErroredInputs,
  })  

  useEffect(() => {    
    inputs.email.ref.current.focus()
  }, [])

  useEffect(() => {    
    if (erroredInputs[0]) {
      erroredInputs[0].focus()
    }
  }, [erroredInputs])

  const handleSignIn = async () => {
    const validateInputFieldsResult = validateInputFields(inputs)
    if (validateInputFieldsResult.status === 'error') { 
      throw new Error(validateInputFieldsResult.message) 
    }
    if (validateInputFieldsResult.status !== 'ok') return
    
    send('SIGN_IN', {    
          requestType: 'signInWihCredentials',
          email: emailRef.current.value, 
          password: passwordRef.current.value, 
          rememberMe: rememberMeRef.current.checked
    })      
  }
  
  return (
    <>        
      <Grid className={moduleStyle.wrapper}>
        <Paper className={moduleStyle.loginBox} elevation={0}>
          <Box>
            <img src={logo} alt={config.app.corporateTitle} className={moduleStyle.logo} />
          </Box>

          <Box className={moduleStyle.loginBoxContent}>
            <InputGroup label={inputs.email.label} type={inputs.email.type} inputRef={emailRef} errorText={inputs.email.errorText} fullWidth />
            <InputGroup label={inputs.password.label} type={inputs.password.type} inputRef={passwordRef} errorText={inputs.password.errorText} fullWidth />
            <CheckBoxGroup label='Remember me' inputRef={rememberMeRef} className={moduleStyle.checkBoxGroup} />
          </Box>
          <Box className={moduleStyle.loginBoxfooter}>
            <LoadingButton 
              variant='contained' 
              fullWidth 
              onClick={handleSignIn}
              disabled={state.context.inProgress}
              loading={state.context.inProgress}
              endIcon={<></>}
              loadingPosition='end' 
            >
              Sign in
            </LoadingButton>
          </Box>
          <Box className={moduleStyle.errorBox}>
            { (state.context.userInfo.status === 'accountIsExpired' || state.context.userInfo.status === 'warning' || state.context.userInfo.status === 'error')
                ? 
                  <FormError message={state.context.userInfo.message} />
                :
                  ''
            }
          </Box>
        </Paper>
      </Grid>
    </>
  );
  
};

export default SignIn;