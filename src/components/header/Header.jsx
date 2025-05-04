import { NavLink } from "react-router-dom";
import "./Header.modules.css";

function Header() {
    return (
        <header className="header">
            <h1>Simpel boekhouden! 🖊️</h1>
            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/invoices" className={({ isActive }) => isActive ? "active" : ""}>
                            Inkomsten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/expenses" className={({ isActive }) => isActive ? "active" : ""}>
                            uitgaven
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clients" className={({ isActive }) => isActive ? "active" : ""}>
                            Cliënten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings" className={({ isActive }) => isActive ? "active" : ""}>
                            Boekingslijst
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/year-overview" className={({ isActive }) => isActive ? "active" : ""}>
                            Jaaroverzicht
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
