import {useYear} from "../../contexts/YearContext.jsx";
import styles from "./YearSelector.module.css";

const YearSelector = () => {
    const { selectedYear, setSelectedYear } = useYear();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <div className={styles.yearSelector}>
            <label htmlFor="year-select">Jaar: </label>
            <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default YearSelector;