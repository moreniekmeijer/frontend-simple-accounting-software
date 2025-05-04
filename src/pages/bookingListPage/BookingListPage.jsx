import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingListPage.module.css";

function BookingListPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expensesRes, invoicesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/expenses`),
                    axios.get(`${import.meta.env.VITE_API_URL}/invoices`),
                ]);

                const expenses = expensesRes.data.map((e, index) => ({
                    nr: index + 1,
                    date: new Date(e.date).toLocaleDateString("nl-NL", { day: '2-digit', month: '2-digit' }),
                    post: e.vendor,
                    code: e.invoiceNumber,
                    category: e.category,
                    vat: `${e.vat.toFixed(2)}%`,
                    income: 0,
                    expense: parseFloat(e.amount),
                }));

                const startNr = expenses.length + 1;

                const invoices = invoicesRes.data.flatMap((inv, i) => {
                    const totalIncl = parseFloat(inv.totalInclVat);
                    return [{
                        nr: startNr + i,
                        date: new Date(inv.invoiceDate).toLocaleDateString("nl-NL", { day: '2-digit', month: '2-digit' }),
                        post: inv.client.name,
                        code: inv.invoiceNumber,
                        category: "honorarium",
                        vat: "0%", // Pas aan als je btw per lijn wil tonen
                        income: totalIncl,
                        expense: 0,
                    }];
                });

                const combined = [...expenses, ...invoices];
                combined.sort((a, b) => a.date - b.date); // Sorteren op nummer (of pas aan op datum)

                setBookings(combined);
            } catch (error) {
                console.error("Fout bij ophalen data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.bookingList}>
            <h3>Boekingslijst</h3>
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
                </tr>
                </thead>
                <tbody>
                {bookings.map((b) => (
                    <tr key={b.nr}>
                        <td>{b.nr}</td>
                        <td>{b.date}</td>
                        <td>{b.post}</td>
                        <td>{b.code}</td>
                        <td>{b.category}</td>
                        <td>{b.vat}</td>
                        <td>{b.income > 0 ? `€ ${b.income.toFixed(2)}` : ""}</td>
                        <td>{b.expense > 0 ? `€ ${b.expense.toFixed(2)}` : ""}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BookingListPage;
