import {NavLink} from "react-router-dom";
import "./Header.module.css";
import styles from "./Header.module.css";
import YearSelector from "../yearSelector/YearSelector.jsx";

function Header() {
    return (
        <header className={styles.header}>
            <h1>Simpel boekhouden! 🖊️</h1>
            <YearSelector />

            <nav>
                <ul>
                    <li>
                        <NavLink to="/invoices" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Inkomsten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/expenses" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Uitgaven
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clients" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Cliënten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Boekingslijst
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/year-overview" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Jaaroverzicht
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/company-details" className={({isActive}) => isActive ? styles.activeMenuLink : ""}>
                            Bedrijfsgegevens
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;