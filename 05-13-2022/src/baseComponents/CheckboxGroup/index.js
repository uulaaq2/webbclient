import React from 'react'
import { Checkbox, FormControlLabel, Typography } from '@mui/material'
import style from './style.css'

const CheckBoxGroup = ({ label, color, ...rest }) => {
  return (
    <FormControlLabel 
      control={<Checkbox color="primary" />}
      label={<Typography className={style.label}>{label}</Typography>}
      {...rest}
    />
  );
};

export default CheckBoxGroup