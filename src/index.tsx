import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RecoilRoot} from "recoil";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import BudgetPage from "./components/BudgetPage";
import TransactionsPage from "./components/TransactionsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ErrorPage from "./components/ErrorPage"
import LoginPage from "./components/LoginPage";
import SettingsPage from "./components/SettingsPage";
import SignUpPage from "./components/SignUpPage";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RecoilRoot>
          <BrowserRouter basename="/simplebudget">
              <Routes>
                  <Route path='/' errorElement={<ErrorPage/>} element={<App/>}>
                      <Route path='budget' element={<BudgetPage/>}/>
                      <Route path='transactions' element={<TransactionsPage/>}/>
                      <Route path='analytics' element={<AnalyticsPage/>}/>
                      <Route path='settings' element={<SettingsPage/>}/>
                  </Route>
                  <Route path='login' element={<LoginPage/>}/>
                  <Route path='signup' element={<SignUpPage/>}/>
              </Routes>
          </BrowserRouter>
      </RecoilRoot>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();