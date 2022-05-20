import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGetUserInfo from 'functions/user/useGetUserInfo'
import config from 'config'
import PageLoading from 'components/PageLoading/index'
import AppNavBar from 'components/AppNavBar'

const index = ({ element }) => {
  const userInfo = useGetUserInfo()
  const navigate = useNavigate()

  useEffect(() => {   
    if (userInfo.completed && !userInfo.success) {
      navigate(config.urls.public.path)
    }
  }, [userInfo.completed])

  if (userInfo.inProgress) {
    return <PageLoading />
  }

  if (userInfo.completed === true) {      
    if (userInfo.success) {
      return (
        <>
          <AppNavBar />
          { element }
        </>
      )
    }
  }  

}

export default index