import { useEffect, useState } from "react";
import styles from "./BookingListPage.module.css";

function BookingListPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const dummy = [
            { nr: 1, date: "1-1", post: "Makro (koop laptop)", code: "", category: "investering", vat: "21%", income: 0, expense: 0 },
            { nr: 2, date: "1-1", post: "RME Fireface 802", code: "", category: "investering", vat: "0%", income: 0, expense: 85 },
            { nr: 3, date: "1-1", post: "Macbook Air", code: "", category: "investering", vat: "0%", income: 0, expense: 200 },
            { nr: 4, date: "26-1", post: "Tom Gregoor", code: "20250101", category: "honorarium", vat: "0%", income: 250, expense: 0 },
            { nr: 5, date: "6-2", post: "WAMV", code: "WA202501", category: "honorarium", vat: "0%", income: 715, expense: 0 },
            { nr: 6, date: "6-2", post: "T2 Centrum voor Muziek V.O.F.", code: "T2202501", category: "honorarium", vat: "0%", income: 280.93, expense: 0 },
            { nr: 7, date: "19-3", post: "WAMV", code: "WA202502", category: "honorarium", vat: "0%", income: 715, expense: 0 },
            { nr: 8, date: "19-3", post: "T2 Centrum voor Muziek V.O.F.", code: "T2202502", category: "honorarium", vat: "0%", income: 280.93, expense: 0 },
            { nr: 9, date: "4-4", post: "Twents Jeugd SymfonieOrkest", code: "20250301", category: "honorarium", vat: "0%", income: 80, expense: 0 },
            { nr: 10, date: "4-4", post: "WAMV", code: "WA202503", category: "honorarium", vat: "0%", income: 536.25, expense: 0 },
            { nr: 11, date: "4-4", post: "T2 Centrum voor Muziek V.O.F.", code: "T2202503", category: "honorarium", vat: "0%", income: 280.93, expense: 0 },
        ];
        setBookings(dummy);
    }, []);

    return (
        <div className={styles.bookingList}>
            <h2>Boekingslijst</h2>
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
