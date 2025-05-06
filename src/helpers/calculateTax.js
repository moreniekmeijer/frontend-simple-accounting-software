// All in Dutch because of the Dutch tax terminology

export function calculateTax({ belastinggrondslag, winstUitOnderneming, arbeidsinkomen }) {
    const schijf1Grens = 75518;
    const schijf1Tarief = 0.3697;
    const schijf2Tarief = 0.495;

    // Stap 1: Inkomstenbelasting
    const inkomstenbelasting = belastinggrondslag <= schijf1Grens
        ? belastinggrondslag * schijf1Tarief
        : schijf1Grens * schijf1Tarief + (belastinggrondslag - schijf1Grens) * schijf2Tarief;

    // Stap 2: Algemene heffingskorting (2025 benadering)
    let algemeneHeffingskorting;
    if (belastinggrondslag <= 22660) {
        algemeneHeffingskorting = 3233;
    } else if (belastinggrondslag <= 75479) {
        algemeneHeffingskorting = 3233 - ((belastinggrondslag - 22660) * 0.0607);
    } else {
        algemeneHeffingskorting = 0;
    }

    // Stap 3: Arbeidskorting (2025 benadering)
    let arbeidskorting;
    if (arbeidsinkomen <= 10964) {
        arbeidskorting = arbeidsinkomen * 0.0511;
    } else if (arbeidsinkomen <= 39957) {
        arbeidskorting = 560 + (arbeidsinkomen - 10964) * 0.0651;
    } else if (arbeidsinkomen <= 124934) {
        arbeidskorting = 5052 - (arbeidsinkomen - 39957) * 0.0651;
    } else {
        arbeidskorting = 0;
    }

    // Stap 4: Zvw-bijdrage (alleen over winst uit onderneming)
    const zvwBijdrage = winstUitOnderneming * 0.0532;

    // Stap 5: Eindbedrag
    const totaalKorting = Math.max(0, algemeneHeffingskorting) + Math.max(0, arbeidskorting);
    const brutoBelasting = inkomstenbelasting - totaalKorting;
    const nettoBelasting = Math.max(0, brutoBelasting) + zvwBijdrage;

    return {
        belastinggrondslag,
        inkomstenbelasting,
        algemeneHeffingskorting,
        arbeidskorting,
        zvwBijdrage,
        totaalBelasting: Math.round(nettoBelasting)
    };
}

