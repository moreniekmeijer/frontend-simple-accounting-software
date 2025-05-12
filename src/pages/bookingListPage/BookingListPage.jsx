import {useEffect, useState} from "react";
import axios from "axios";
import styles from "./BookingListPage.module.css";
import Button from "../../components/button/Button.jsx";
import {useYear} from "../../contexts/YearContext.jsx";
import YearSelector from "../../components/yearSelector/YearSelector.jsx";
import OpenPdfButton from "../../components/openPdfButton/OpenPdfButton.jsx";

function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const {selectedYear} = useYear();

    const fetchData = async () => {
        try {
            const [expensesRes, invoicesRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {params: {year: selectedYear}}),
                axios.get(`${import.meta.env.VITE_API_URL}/invoices`, {params: {year: selectedYear}}),
            ]);

            const expenses = expensesRes.data
                .filter(e => !e.investmentDetails || e.investmentDetails.bookValue > 0)
                .map((e, index) => {
                    const dateObj = new Date(e.date);
                    return {
                        id: e.id,
                        type: "expense",
                        nr: index + 1,
                        date: dateObj.toLocaleDateString("nl-NL", {day: "2-digit", month: "2-digit"}),
                        rawDate: dateObj,
                        post: e.vendor,
                        code: e.invoiceNumber,
                        category: e.category,
                        vat: `${e.vat.toFixed(2)}%`,
                        income: 0,
                        expense: e.category === "investering" && e.investmentDetails
                            ? parseFloat(e.investmentDetails.annualDepreciation)
                            : parseFloat(e.amount),
                        driveUrl: e.driveUrl,
                    };
                });

            const startNr = expenses.length + 1;

            const invoices = invoicesRes.data.map((inv, i) => {
                const dateObj = new Date(inv.invoiceDate);
                return {
                    id: inv.id,
                    type: "invoice",
                    nr: startNr + i,
                    date: dateObj.toLocaleDateString("nl-NL", {day: "2-digit", month: "2-digit"}),
                    rawDate: dateObj,
                    post: inv.client.name,
                    code: inv.invoiceNumber,
                    category: "honorarium",
                    vat: "0%",
                    income: parseFloat(inv.totalInclVat),
                    expense: 0,
                    driveUrl: inv.driveUrl,
                };
            });

            const combined = [...expenses, ...invoices].sort((a, b) => a.nr - b.nr);
            setBookings(combined);
        } catch (error) {
            console.error("Fout bij ophalen data:", error);
        }
    };

    useEffect(() => {
        void fetchData();
    }, [selectedYear]);

    const handleDelete = async (id, type) => {
        const endpoint = `${import.meta.env.VITE_API_URL}/${type}s/${id}`;
        if (!window.confirm("Weet je zeker dat je dit item wilt verwijderen?")) return;

        try {
            await axios.delete(endpoint);
            setBookings((prev) => prev.filter((b) => !(b.id === id && b.type === type)));
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
            alert("Verwijderen mislukt. Probeer het opnieuw.");
        }
    };

    return (
        <div className={styles.bookingList}>
            <h3>Boekingslijst</h3>

            <YearSelector />

            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                    <tr>
                        <th>Nr.</th>
                        <th>Datum</th>
                        <th>Post</th>
                        <th>Code</th>
                        <th>Categorie</th>
                        <th>BTW</th>
                        <th>Inkomsten</th>
                        <th>Uitgaven</th>
                        <th>Acties</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((b) => (
                        <tr key={`${b.type}-${b.id}`}>
                            <td>{b.nr}</td>
                            <td>{b.date}</td>
                            <td>{b.post}</td>
                            <td>{b.code}</td>
                            <td>{b.category}</td>
                            <td>{b.vat}</td>
                            <td>{b.income > 0 ? `€ ${b.income.toFixed(2)}` : ""}</td>
                            <td>{b.expense > 0 ? `€ ${b.expense.toFixed(2)}` : ""}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(b.id, b.type)}>Verwijder</Button>
                                {b.driveUrl && (
                                    <OpenPdfButton driveUrl={b.driveUrl} invoiceNumber={b.invoiceNumber}/>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BookingListPage;
