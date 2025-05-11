import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from "react-router-dom";
import {YearProvider} from "./contexts/YearContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <YearProvider>
                <App/>
            </YearProvider>
        </Router>
    </StrictMode>,
)
