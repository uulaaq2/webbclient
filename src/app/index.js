import style from 'app/style.css'
import React, { createContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import PrivateRoute from 'components/privateRoute'

import Home from 'pages/home'
import Public from 'pages/public'
import SignIn from 'pages/signIn'
import ChangePassword from 'pages/changePassword'
import Protected from 'pages/protected'

const App = () => {
 
  return (
      <Router>
        <Routes>        
            <Route exact path="/" element={<Home />} />                    
            <Route exact path="public" element={<Public />} />        
            <Route exact path="signIn" element={<SignIn />} />
            <Route exact path="me/changepassword/:token" element={<ChangePassword />} />            
            <Route 
              path="protected" 
              element={
                <PrivateRoute element={<Protected />} />
              }            
            />                  
        </Routes>
      </Router>
  );
};

export default App;