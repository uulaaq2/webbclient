import React, { useRef } from 'react';

const SignIn = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  
  return (
    <div>
      <input type="text" ref={emailRef} />
      <input type="password" ref={passwordRef} />
      <button onClick={null}>Sign in</button>
    </div>
  );
};

export default SignIn;