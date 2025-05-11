import {NavLink} from "react-router-dom";
import "./Header.module.css";
import {useYear} from "../../contexts/YearContext.jsx";
import styles from "./Header.module.css";

function Header() {
    const {selectedYear, setSelectedYear} = useYear();

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    return (
        <header className="header">
            <h1>Simpel boekhouden! 🖊️</h1>
            <div className={styles.yearSelector}>
                <label htmlFor="year">Jaar: </label>
                <select id="year" value={selectedYear} onChange={handleYearChange}>
                    {[2022, 2023, 2024, 2025].map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/invoices" className={({isActive}) => isActive ? "active" : ""}>
                            Inkomsten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/expenses" className={({isActive}) => isActive ? "active" : ""}>
                            Uitgaven
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clients" className={({isActive}) => isActive ? "active" : ""}>
                            Cliënten
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings" className={({isActive}) => isActive ? "active" : ""}>
                            Boekingslijst
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/year-overview" className={({isActive}) => isActive ? "active" : ""}>
                            Jaaroverzicht
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/company-details" className={({isActive}) => isActive ? "active" : ""}>
                            Bedrijfsgegevens
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;