import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import logo from 'images/logo.png'
import config from 'config'
import pageInitial from 'functions/pageInitial'
import moduleStyle from 'pages/public/changePassword/style.css'
import { validateInputFields } from 'functions/validateInputFields'
import FormError from 'baseComponents/Alerts/FormError'
import InputGroup from 'baseComponents/InputGroup'

import { useNavigate } from 'react-router-dom'
import { Grid, Paper, Box, Stack, Button, CircularProgress, Typography, Grow } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { CheckCircleOutline } from '@mui/icons-material'

const getToken = (token) => token.substring(0, token.length - 2)
const getShowCurrentPassword = (token) => token.charAt(token.length - 2) === '1' ? true : false
const getRedirectToUsersHomePage = (token) => token.charAt(token.length - 1) === '1' ? true : false

import { GlobalStateContext } from 'state/globalState'
import { useActor } from '@xstate/react'
import { Password } from '@mui/icons-material'

const ChangePassword = () => {
  pageInitial( {pageName: 'user.changePassword'} )

  const globalServices = useContext(GlobalStateContext)  
  const { send } = globalServices.authService
  const [ state  ] = useActor(globalServices.authService)  
  const [showPasswordIsChanged, setShowPasswordIsChanged] = useState(false)

  const { token } = useParams()
  const navigate = useNavigate()
  
  const currentPasswordRef = useRef()
  const newPasswordRef = useRef()
  const confirmNewPasswordRef = useRef()  
  
  const [erroredInputs, setErroredInputs] = useState([])  
  const [inputs] = useState({
    currentPassword: {      
      label: 'Current password',
      type: 'password',
      errorText: '',
      ref: currentPasswordRef,
      required: getShowCurrentPassword(token),
      validate: getShowCurrentPassword(token)
    },    
    newPassword: {      
      label: 'New password',
      type: 'password',
      errorText: '',
      ref: newPasswordRef,
      required: true,
      validate: true
    },
    confirmNewPassword: {
      label: 'Confirm new password',
      type: 'password',
      errorText: '',
      ref: confirmNewPasswordRef,
      match: newPasswordRef,
      matchLabel: 'New Password',
      required: true,
      validate: true
    },
    inputErors: 0,
    setErroredInputs: setErroredInputs,
  })  

  useEffect(() => {
    const fieldToFocus = getShowCurrentPassword(token) ? currentPasswordRef : newPasswordRef    

    fieldToFocus.current.focus()
  }, [])

  useEffect(() => {    
    if (erroredInputs[0]) {
      erroredInputs[0].focus()
    }
  }, [erroredInputs])

  useEffect(() => {
    console.log(state.value)
    console.log(state.context.userInfo)
    if (state.value === 'finished' && state.context.userInfo.status === 'ok') {
      setShowPasswordIsChanged(true)
      console.log('aaa')
    }
  }, [state.value])

  const handleChangePassword = async () => {
    try {
      const validateInputFieldsResult = validateInputFields(inputs)
      if (validateInputFieldsResult.status === 'error') { 
        throw new Error(validateInputFieldsResult.message) 
      }
      if (validateInputFieldsResult.status !== 'ok') return

      send('SIGN_IN', {    
        requestType: 'changeUserPassword',
        token: getToken(token),
        password: newPasswordRef.current.value
      })    
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Grid className={moduleStyle.wrapper}>
        <Paper className={moduleStyle.box} elevation={0}>
          <Box>
            <img src={logo} alt={config.app.corporateTitle} className={moduleStyle.logo} />
          </Box>

          { !showPasswordIsChanged ? 
              <>
                <Box className={moduleStyle.title}>
                  <Typography variant='h5'>Change your password</Typography>
                </Box>

                <Box className={moduleStyle.boxContent}>
                  { getShowCurrentPassword(token) 
                    ? 
                      <InputGroup label={inputs.currentPassword.label} type={inputs.currentPassword.type} inputRef={currentPasswordRef} errorText={inputs.currentPassword.errorText} fullWidth />
                    :
                      ''
                  }
                  <InputGroup label={inputs.newPassword.label} type={inputs.newPassword.type} inputRef={newPasswordRef} errorText={inputs.newPassword.errorText} fullWidth />
                  <InputGroup label={inputs.confirmNewPassword.label} type={inputs.confirmNewPassword.type} inputRef={confirmNewPasswordRef} errorText={inputs.confirmNewPassword.errorText} fullWidth />
                </Box>
                <Box className={moduleStyle.boxfooter}>
                  <LoadingButton 
                    variant='contained' 
                    onClick={handleChangePassword} 
                    fullWidth 
                    disabled={state.inProgress}
                    loading={state.inProgress}
                    endIcon={<></>} 
                    loadingPosition='end' 
                  >
                    Change password
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
              </>
            :
              <PasswordIsChanged countDownFrom={10} redirectTo={config.urls.home} />      
          }

        </Paper>
      </Grid>
    </>
  );
}

const PasswordIsChanged = ({ countDownFrom, redirectTo }) => {
  const [counter, setCounter] = useState(countDownFrom)
  const navigate = useNavigate()
  
  useEffect(() => {

  }, [])

  useEffect(() => {
    if (countDownFrom === null) return

    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      handleRedirect()
    }
    return () => clearInterval(timer);    
  }, [counter]);

  function handleRedirect() {
    if (!redirectTo)  {
      navigate('/')
    } else {
      navigate(redirectTo.path)
    }
  }
  
  return (
    <Typography component="div">
      <Box sx={{ width: '100%'}}>
        <Grow in={true}>
          <Stack spacing={5} alignItems="center" justifyContent="center" style={{padding: "2rem"}}>
            <CheckCircleOutline color="success" style={{fontSize: "3rem"}} />
            <Box sx={{ fontSize: 'h5.fontSize', m: 1 }}>
              New password is set
            </Box>
            <Button variant='contained' onClick={handleRedirect}>
              {`Go to ${redirectTo.name} ${counter}`}
            </Button>
          </Stack>
        </Grow>
      </Box>
    </Typography>
  )
}

export default ChangePassword;