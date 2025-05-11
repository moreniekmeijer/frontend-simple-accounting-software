import styles from './YearOverviewPage.module.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {calculateTax} from "../../helpers/calculateTax.js";
import {useYear} from "../../contexts/YearContext.jsx";

function YearOverviewPage() {
    const [expenses, setExpenses] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [otherIncome, setOtherIncome] = useState(0);
    const { selectedYear } = useYear();

    const handleOtherIncomeChange = (e) => {
        setOtherIncome(Number(e.target.value));
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        });
    };

    const sum = (arr) => arr.reduce((acc, val) => acc + val, 0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [expensesRes, invoicesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/expenses`, { params: { year: selectedYear } }),
                    axios.get(`${import.meta.env.VITE_API_URL}/invoices`, { params: { year: selectedYear } }),
                ]);

                setExpenses(expensesRes.data);
                setInvoices(invoicesRes.data);
            } catch (e) {
                console.error("Fout bij ophalen data:", e);
            }
        };

        void fetchData();
    }, [selectedYear]);

    // Inkomsten
    const incomeGross = sum(invoices.map(inv => inv.totalInclVat || 0));
    const incomeNet = sum(invoices.map(inv => inv.totalExclVat || 0));
    const avgIncomePerMonth = incomeGross / 12;

    // Uitgaven
    const expenseGross = sum(expenses.map(e => e.amount));
    const expenseNet = sum(expenses.map(e => e.amount / (1 + (e.vat || 0))));
    const avgExpensePerMonth = expenseGross / 12;

    // Winst
    const profitGross = (incomeGross - expenseGross).toFixed(2);
    const profitNet = (incomeNet - expenseNet).toFixed(2);
    const avgProfitPerMonth = profitNet / 12;

    // Categorisatie uitgaven
    const expenseByCategory = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});

    const selfEmployedDeduction = 3750;
    const starterDeduction = 0;

    const profitBeforeDeductions = profitNet;
    const profitAfterDeductions = profitBeforeDeductions - selfEmployedDeduction - starterDeduction;

    const mkbRelief = profitAfterDeductions * 0.1331;
    const taxableProfit = profitAfterDeductions - mkbRelief;

    const belastinggrondslag = taxableProfit + otherIncome;
    const arbeidsinkomen = profitAfterDeductions + otherIncome;

    const tax = calculateTax({
        belastinggrondslag,
        winstUitOnderneming: taxableProfit,
        arbeidsinkomen
    });

    return (
        <div>
            <h2>Jaaroverzicht {selectedYear}</h2>
            <div className={styles.overviewContainer}>
                <section className={styles.totalContainer}>
                    <section>
                        <h4>Inkomsten</h4>
                        <p>Bruto: {formatCurrency(incomeGross)}</p>
                        <p>Netto: {formatCurrency(incomeNet)}</p>
                        <p>Gemiddeld per maand: {formatCurrency(avgIncomePerMonth)}</p>
                    </section>
                    <section>
                        <h4>Uitgaven</h4>
                        <p>Bruto: {formatCurrency(expenseGross)}</p>
                        <p>Netto: {formatCurrency(expenseNet)}</p>
                        <p>Gemiddeld per maand: {formatCurrency(avgExpensePerMonth)}</p>
                    </section>
                    <section>
                        <h4>Winst/verlies</h4>
                        <p>Bruto: {profitGross}</p>
                        <p>Netto: {profitNet}</p>
                        <p>Gemiddeld per maand: {avgProfitPerMonth.toFixed(2)}</p>
                    </section>
                </section>

                <section>
                    <h4>Uitgavenposten</h4>
                    <ul>
                        {Object.entries(expenseByCategory).map(([category, total]) => (
                            <li key={category}>{category}: {formatCurrency(total)}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h4>Aftrekposten</h4>
                    <p>Winst vóór ondernemersaftrek: {formatCurrency(profitBeforeDeductions)}</p>
                    <p>Zelfstandigenaftrek: {formatCurrency(selfEmployedDeduction)}</p>
                    <p>Startersaftrek: {formatCurrency(starterDeduction)}</p>
                    <p>MKB-winstvrijstelling (13.31%): {formatCurrency(mkbRelief)}</p>
                    <p><strong>Winst na zelfstandigenaftrek (belastbare winst): {formatCurrency(taxableProfit)}</strong></p>
                </section>

                <label>
                    Overige inkomsten (loondienst, etc):
                    <input
                        type="number"
                        value={otherIncome}
                        onChange={handleOtherIncomeChange}
                        step="100"
                    />
                </label>

                <section>
                    <h4>Belastingen</h4>
                    <p>Belastbaar inkomen: {formatCurrency(tax.belastinggrondslag)}</p>
                    <p>Inkomstenbelasting (box 1): {formatCurrency(tax.inkomstenbelasting)}</p>
                    <p>Algemene heffingskorting: -{formatCurrency(tax.algemeneHeffingskorting)}</p>
                    <p>Arbeidskorting: -{formatCurrency(tax.arbeidskorting)}</p>
                    <p>Zvw-bijdrage: +{formatCurrency(tax.zvwBijdrage)}</p>
                    <p><strong>Totaal te betalen: {formatCurrency(tax.totaalBelasting)}</strong></p>
                </section>
            </div>
        </div>
    );
}

export default YearOverviewPage;

