import style from 'app/style.css'
import React, { createContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import PrivateRoute from 'baseComponents/privateRoute'
import { useMachine } from '@xstate/react'
import { appMachine, AppMachineContext } from 'state/appMachine'

import Home from 'pages/home'
import Public from 'pages/public'
import SignIn from 'pages/signIn'
import ChangePassword from 'pages/changePassword'
import Protected from 'pages/protected'

const App = () => {
  const [currentMachine, sendToCurrentMachine, currentService ] = useMachine(appMachine)
  
  return (
    <AppMachineContext.Provider value={{ currentMachine, sendToCurrentMachine, currentService}}>      
      <Router>
        <Routes>        
            <Route exact path="/" element={<Home />} />                    
            <Route exact path="public" element={<Public />} />        
            <Route exact path="signIn" element={<SignIn />} />
            <Route exact path="me/changepassword/:token" element={<ChangePassword />} />            
            <Route 
              path="protected" 
              element={
                <PrivateRoute currentMachine={currentMachine} element={<Protected />} />
              }            
            />                  
        </Routes>
      </Router>
    </AppMachineContext.Provider>    
  );
};

export default App;