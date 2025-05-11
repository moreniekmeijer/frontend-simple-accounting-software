import { createContext, useContext, useState } from "react";

const YearContext = createContext();

export const YearProvider = ({ children }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    return (
        <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
            {children}
        </YearContext.Provider>
    );
};

export const useYear = () => useContext(YearContext);
