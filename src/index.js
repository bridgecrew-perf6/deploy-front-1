import React from 'react';
import './index.css';
import Routes from './routes/routes';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'



const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </React.StrictMode>
);