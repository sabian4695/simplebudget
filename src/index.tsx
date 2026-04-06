import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BudgetPage from "./components/BudgetPage";
import TransactionsPage from "./components/TransactionsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ErrorPage from "./components/ErrorPage"
import LoginPage from "./components/LoginPage";
import SettingsPage from "./components/SettingsPage";
import SignUpPage from "./components/SignUpPage";
import { registerSW } from 'virtual:pwa-register';
import { usePwaStore } from './store/pwaStore';

// Register service worker with update prompt
const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
        usePwaStore.getState().setNeedRefresh(true);
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    },
});

// Store the updateSW function so React components can trigger it
usePwaStore.getState().setUpdateSW(updateSW);

// Force update check when the app regains focus (critical for iOS PWA)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateSW();
    }
});

window.addEventListener('focus', () => {
    updateSW();
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' errorElement={<ErrorPage />} element={<App />}>
                    <Route path='budget' element={<BudgetPage />} />
                    <Route path='transactions' element={<TransactionsPage />} />
                    <Route path='analytics' element={<AnalyticsPage />} />
                    <Route path='settings' element={<SettingsPage />} />
                </Route>
                <Route path='login' element={<LoginPage />} />
                <Route path='signup' element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
