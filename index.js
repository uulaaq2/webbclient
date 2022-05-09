import React from 'react';
import { createRoot } from "react-dom/client";
import App from 'app'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

const theme = createTheme({
      shape: {
            borderRadius: 12,
      },
      typography: {
            //htmlFontSize: 16,            
            button: {
                  textTransform: 'none'
            }
      },
      palette: {
            background: {
                  paper: '#fff'
            },
            navbarColor: {
                  main: '#24292f',
                  contrastText: '#6a0dad'
            }
      },
      shadows: Array(25).fill("none")
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
      <React.StrictMode>
            <App />
      </React.StrictMode>
);