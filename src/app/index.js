import style from 'app/style.css'
import React, { createContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import PrivateRoute from 'components/PrivateRoute'

import Home from 'pages/protected/home'
import Public from 'pages/public/home'
import SignIn from 'pages/signIn'
import ChangePassword from 'pages/public/changePassword'
import NoMatch from 'pages/NoMatch'

const App = () => {
 
  return (
      <Router>

        <Routes>        
            <Route exact path="public" element={<Public />} />        
            <Route exact path="me/changepassword/:token" element={<ChangePassword />} />     

            <Route exact path="signIn" element={<SignIn />} />
            
            <Route 
              path="/" 
              element={
                <PrivateRoute element={<Home />} />
              }            
            />                  

          <Route path="*" element={<NoMatch />} />
        </Routes>

      </Router>
  );
};

export default App;