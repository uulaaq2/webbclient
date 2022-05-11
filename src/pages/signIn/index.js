import React, { useState, useRef, useEffect, useContext } from 'react'

import logo from 'images/logo.png'
import config from 'config'
import pageInitial from 'functions/pageInitial'
import moduleStyle from 'pages/signIn/style.css'
import { clearErrors, validateInputFields } from 'functions/validateInputFields'
import FormError from 'baseComponents/Alerts/FormError'
import InputGroup from 'baseComponents/InputGroup'
import CheckBoxGroup from 'baseComponents/CheckboxGroup'

import { Navigate, useNavigate } from 'react-router-dom'
import { Grid, Paper, Box, Button, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Check } from '@mui/icons-material'
import { AppMachineContext } from 'state/appMachine'

const SignIn = ({ urlInfo }) => {  
  pageInitial( {pageName: 'user.signIn'} )

  const { currentMachine, sendToCurrentMachine} = useContext(AppMachineContext)

  const emailRef = useRef()
  const passwordRef = useRef()
  const rememberMeRef = useRef()  
  const navigate = useNavigate()
  
  const [erroredInputs, setErroredInputs] = useState([])  
  const [inputs] = useState({
    email: {      
      name: 'Email or User Name',
      label: 'Email or User name',
      type: 'text',
      errorText: '',
      ref: emailRef,
      required: true,
      validate: true
    },
    password: {
      name: 'Password',
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
    try {
      const validateInputFieldsResult = validateInputFields(inputs)
      if (validateInputFieldsResult.status === 'error') { 
        throw new Error(validateInputFieldsResult.message) 
      }
      if (validateInputFieldsResult.status !== 'ok') return

      sendToCurrentMachine('VALIDATE', {
        email: emailRef.current.value, 
        password: passwordRef.current.value, 
        rememberMe: rememberMeRef.current.checked 
      })

    } catch (error) {
      setFormError(error.message)
    }
  }
  
  if (currentMachine.context?.userInfo?.status === 'ok') {
   return (navigate(config.urls.home.path))
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
            <LoadingButton variant='contained' fullWidth onClick={handleSignIn} loading={currentMachine.context.inProgress} endIcon={<></>} loadingPosition='end' >Sign in</LoadingButton>
          </Box>
          <Box>
          
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default SignIn;