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


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RecoilRoot>
          <BrowserRouter>
              <Routes>
                  <Route path='/' errorElement={<ErrorPage/>} element={<App/>}>
                      <Route path='budget' element={<BudgetPage/>}/>
                      <Route path='transactions' element={<TransactionsPage/>}/>
                      <Route path='analytics' element={<AnalyticsPage/>}/>
                      <Route path='settings' element={<SettingsPage/>}/>
                  </Route>
                  <Route path='login' element={<LoginPage/>}/>
              </Routes>
          </BrowserRouter>
      </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();