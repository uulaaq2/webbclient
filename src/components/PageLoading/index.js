import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import moduleStyle from 'components/PageLoading/style.css'

const PageLoading = () => {
  return (
    <Box className={moduleStyle.page} >
      <CircularProgress />
    </Box>
  )
}

export default PageLoading