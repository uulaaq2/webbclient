import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate()
  
  useEffect(() => {

  }, [])

  useEffect(() => {

  }, [])

  return (
    <div>
      home
      <button onClick={() => navigate('/signin')}>aaa</button>
    </div>
  );
};

export default Home;