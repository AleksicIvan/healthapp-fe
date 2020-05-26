import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorBoundry from './components/Error'
import UserContextProvider from './context/UserContext'
import { SnackbarProvider } from 'notistack'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundry>
      <UserContextProvider>
        <SnackbarProvider maxSnack={3}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <App />
        </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </UserContextProvider>
    </ErrorBoundry>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
