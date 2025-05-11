import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import InvoicePage from "./pages/invoicePage/InvoicePage.jsx";
import ClientPage from "./pages/clientPage/ClientPage.jsx";
import BookingListPage from "./pages/bookingListPage/BookingListPage.jsx";
import YearOverviewPage from "./pages/yearOverviewPage/YearOverviewPage.jsx";
import ExpensePage from "./pages/expensePage/ExpensePage.jsx";
import CompanyDetailsPage from "./pages/companyDetailsPage/companyDetailsPage.jsx";

function App() {
    return (
        <>
            <Header/>
            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/invoices" />} />
                    <Route path="/invoices" element={<InvoicePage />} />
                    <Route path="/expenses" element={<ExpensePage />} />
                    <Route path="/clients" element={<ClientPage />} />
                    <Route path="/bookings" element={<BookingListPage />} />
                    <Route path="/year-overview" element={<YearOverviewPage />} />
                    <Route path="/company-details" element={<CompanyDetailsPage />} />
                    {/*<Route path="*" element={<NotFoundPage/>}/>*/}
                </Routes>
            </main>
        </>
    )
}

export default App
