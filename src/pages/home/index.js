import React, { useEffect, useContext } from 'react'
import { getUser } from 'functions/user/getUser'
import { AppMachineContext } from 'state/appMachine';

const Home = () => {
  const { currentMachine, sendToCurrentMachine } = useContext(AppMachineContext)
  
  useEffect(() => {
    sendToCurrentMachine('VALIDATE', {email: 'muhittin.yendun@au.indorama.net', password: '111'})
    //console.log(currentMachine.context)
  }, [])

  useEffect(() => {
    //console.log(currentMachine)
  }, [currentMachine])
  return (
    <div>
      
    </div>
  );
};

export default Home;