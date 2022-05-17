import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useIsSignedIn from 'functions/user/useIsSignedIn'

const Home = () => {
  const navigate = useNavigate()
  const isSignedIn = useIsSignedIn()
  
  useEffect(() => {
    console.log('isSignedIn ', isSignedIn)
  }, [isSignedIn])

  return (
    <div>
      home
      <button onClick={() => navigate('/signin')}>aaa</button>
    </div>
  );
};

export default Home;