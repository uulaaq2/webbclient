import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import logo from 'images/logo.png'
import config from 'config'
import pageInitial from 'functions/pageInitial'
import moduleStyle from 'pages/ChangePassword/style.css'
import { validateInputFields } from 'functions/validateInputFields'
import FormError from 'baseComponents/Alerts/FormError'
import InputGroup from 'baseComponents/InputGroup'
import CheckBoxGroup from 'baseComponents/CheckboxGroup'

import changeUserPassword from 'functions/user/changeUserPassword'

import { Navigate, useNavigate } from 'react-router-dom'
import { Grid, Paper, Box, Button, CircularProgress, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AppMachineContext } from 'state/appMachine'

const getToken = (token) => token.substring(0, token.length - 2)
const getShowCurrentPassword = (token) => token.charAt(token.length - 2) === '1' ? true : false
const getRememberMe = (token) => token.charAt(token.length - 1) === '1' ? true : false

const ChanePassword = () => {
  pageInitial( {pageName: 'user.changePassword'} )

  const { token } = useParams()

  const { currentMachine, sendToCurrentMachine, currentService } = useContext(AppMachineContext)

  const currentPasswordRef = useRef()
  const newPasswordRef = useRef()
  const confirmNewPasswordRef = useRef()  
  const navigate = useNavigate()
  
  const [erroredInputs, setErroredInputs] = useState([])  
  const [inputs] = useState({
    currentPassword: {      
      name: 'Current password',
      label: 'Current password',
      type: 'password',
      errorText: '',
      ref: currentPasswordRef,
      required: getShowCurrentPassword(token),
      validate: getShowCurrentPassword(token)
    },    
    newPassword: {      
      name: 'New password',
      label: 'New password',
      type: 'password',
      errorText: '',
      ref: newPasswordRef,
      required: true,
      validate: true
    },
    confirmNewPassword: {
      name: 'Confirm new password',
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

  const handleChangePassword = async () => {
    try {
      const validateInputFieldsResult = validateInputFields(inputs)
      if (validateInputFieldsResult.status === 'error') { 
        throw new Error(validateInputFieldsResult.message) 
      }
      if (validateInputFieldsResult.status !== 'ok') return

      const aaa = await changePassword(getToken(token), newPasswordRef.current.value)
      console.log(aaa)

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
            <LoadingButton variant='contained' onClick={handleChangePassword} fullWidth loading={currentMachine.context.inProgress} endIcon={<></>} loadingPosition='end' >Change password</LoadingButton>
          </Box>
          <Box className={moduleStyle.boxError}> 
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default ChanePassword;