function YearOverviewPage() {
    return (
        <div className="year-overview">
            <h2>Jaaroverzicht 2025</h2>

            <section>
                <h3>Inkomsten</h3>
                <p>Bruto: € 3.139</p>
                <p>Netto: € 3.102</p>
                <p>Gemiddeld per maand: € 50</p>
            </section>

            <section>
                <h3>Uitgaven</h3>
                <p>Bruto: € 285</p>
                <p>Netto: € 285</p>
                <p>Gemiddeld per maand: € 57</p>
                <p>Investeringen: € 285</p>
            </section>

            <section>
                <h3>Winst / Verlies</h3>
                <p>Winst vóór ondernemersaftrek: -€ 35</p>
                <p>Zelfstandigenaftrek: € 5.030</p>
                <p>MKB-vrijstelling: -€ 709</p>
                <p><strong>Winst uit onderneming: -€ 4.356</strong></p>
            </section>

            <section>
                <h3>Belasting</h3>
                <p>Belastbaar inkomen: € 0</p>
                <p>Schijf 1: € 58</p>
                <p>Totale heffingskortingen: € 2.488</p>
                <p>Premies volksverzekeringen: € 178</p>
                <p>Inkomstenbelasting: € 0</p>
                <p>Zorgverzekering (bijtelling): -€ 248</p>
                <p><strong>Totaal inkomen: € 7.854</strong></p>
            </section>

            <section>
                <h3>Overige</h3>
                <p>Vrijgestelde omzet: € 3.139,04</p>
                <p>Belaste omzet: € 0</p>
                <p>Verhouding belast/onbelast: 0%</p>
                <p>Vooruit ontvangen: € 0</p>
                <p>Kantoorvergoeding: € 5.000</p>
            </section>
        </div>
    );
}

export default YearOverviewPage;
