import React from 'react'
import { useNavigate } from 'react-router-dom'

const Public = () => {
  const navigate = useNavigate()
  return (
    <div>
      public
      <button onClick={() => navigate('/signin')}>Sign in</button>
    </div>
  );
};

export default Public;