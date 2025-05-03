import { NavLink } from "react-router-dom";
import "./Header.modules.css";

function Header() {
    return (
        <header className="header">
            <h1>Simple Accounting</h1>
            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/invoices" className={({ isActive }) => isActive ? "active" : ""}>
                            Invoices
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clients" className={({ isActive }) => isActive ? "active" : ""}>
                            Clients
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings" className={({ isActive }) => isActive ? "active" : ""}>
                            Booking List
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/year-overview" className={({ isActive }) => isActive ? "active" : ""}>
                            Year Overview
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
