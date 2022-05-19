import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGetUserInfo from 'functions/user/useGetUserInfo'
import config from 'config'
import PageLoading from 'components/PageLoading/index'
import SignIn from 'pages/signin/SignIn'
import { ConstructionOutlined } from '@mui/icons-material'

const index = () => {
  const userInfo = useGetUserInfo()
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo.success) {
      navigate(userInfo.user.Home_Page || config.urls.public.path)
    }
  }, [userInfo.completed])

  if (userInfo.inProgress) {
    return <PageLoading />
  }

  if (userInfo.completed === true) {      
    if (!userInfo.success) {
      return <SignIn />
    }
  }  

}

export default index