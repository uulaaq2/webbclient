import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom"
import config from 'config'

const PrivateRoute = ({ currentMachine, element }) => {
  const navigate = useNavigate()  

  useEffect(() => {
    if (!currentMachine.context.user) {
      navigate(config.urls.user.signIn.path)      
    }   
  }, [])

  return element
};

export default PrivateRoute;