import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import HomePage from "./pages/homePage/HomePage.jsx";

function App() {
    return (
        <>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="*" element={<HomePage/>}/>
                </Routes>
            </main>
        </>
    )
}

export default App
