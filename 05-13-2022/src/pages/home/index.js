import React, { useEffect, useContext } from 'react'
import { signInWithCredentials } from 'functions/user/signInWithCredentials'
import { AppMachineContext } from 'state/appMachine';

const Home = () => {
  const { currentMachine, sendToCurrentMachine } = useContext(AppMachineContext)
  
  useEffect(() => {
    sendToCurrentMachine('SIGN_IN_WITH_CREDENTIALS', {email: 'muhittin.yendun@au.indorama.net', password: '111'})
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