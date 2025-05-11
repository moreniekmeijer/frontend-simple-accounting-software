import React, {useEffect, useState} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from "axios";
import Button from "../button/Button.jsx";
import styles from "./CreateInvoiceForm.module.css";

function CreateInvoiceForm() {
    const {register, control, handleSubmit, reset, watch} = useForm({
        defaultValues: {
            invoiceNumber: "",
            invoiceDate: "",
            clientId: "",
            lines: [{
                type: "time",
                description: "",
                date: "",
                durationMinutes: "",
                hourlyRate: "",
                distanceKm: "",
                ratePerKm: "",
                amount: ""
            }],
        }
    });

    const {fields, append, remove} = useFieldArray({control, name: "lines"});
    const [clients, setClients] = useState([]);
    const [createdInvoice, setCreatedInvoice] = useState(null);
    const watchedLines = watch("lines");

    // Haal alle klanten op bij het laden van de pagina
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients`);
                setClients(res.data);
            } catch (err) {
                console.error("Failed to load clients", err);
            }
        })();
    }, []);

    // Functie om lege regels te creëren voor time of travel type
    const createEmptyLine = (type) => ({
        type,
        description: type === "travel" ? "Reiskosten" : "",
        date: "",
        durationMinutes: "",
        hourlyRate: "",
        distanceKm: "",
        ratePerKm: "",
        amount: ""
    });

    const handleAddLine = (type) => {
        // Krijg de laatste regel als voorbeeld (als er een regel is)
        const lastLine = watchedLines[watchedLines.length - 1] || {};

        // Maak een nieuwe lege regel
        const newLine = createEmptyLine(type);

        // Als de laatste regel van hetzelfde type is, kopieer de waarden naar de nieuwe regel
        if (lastLine.type === type) {
            newLine.description = lastLine.description || newLine.description;
            newLine.date = lastLine.date || newLine.date;
            newLine.durationMinutes = lastLine.durationMinutes || newLine.durationMinutes;
            newLine.hourlyRate = lastLine.hourlyRate || newLine.hourlyRate;
            newLine.distanceKm = lastLine.distanceKm || newLine.distanceKm;
            newLine.ratePerKm = lastLine.ratePerKm || newLine.ratePerKm;
            newLine.amount = lastLine.amount || newLine.amount;
        }

        // Voeg de nieuwe regel toe
        append(newLine);
    };

    // Validatie van de invoice lines
    const validateLine = (line, index) => {
        const isTime = line.type === "time";
        const isTravel = line.type === "travel";

        const hasAmount = line.amount !== "" && !isNaN(line.amount);
        const hasTimeAndRate = line.durationMinutes !== "" && line.hourlyRate !== "";
        const hasDistanceAndRate = line.distanceKm !== "" && line.ratePerKm !== "";

        // Als er een bedrag ingevuld is, moeten de andere velden leeg zijn
        if (hasAmount) {
            if (isTime && (line.durationMinutes !== "" || line.hourlyRate !== "")) {
                throw new Error(`Regel ${index + 1} kan geen uren en tarief bevatten als het totaalbedrag is ingevuld.`);
            }
            if (isTravel && (line.distanceKm !== "" || line.ratePerKm !== "")) {
                throw new Error(`Regel ${index + 1} kan geen afstand en tarief bevatten als het totaalbedrag is ingevuld.`);
            }
        }

        // Als er geen bedrag ingevuld is, moeten de gedetailleerde velden ingevuld worden
        if (!hasAmount) {
            if (isTime && (!hasTimeAndRate)) {
                throw new Error(`Regel ${index + 1} moet uren en uurtarief bevatten.`);
            }
            if (isTravel && (!hasDistanceAndRate)) {
                throw new Error(`Regel ${index + 1} moet afstand en tarief per km bevatten.`);
            }
        }
    };

    // OnSubmit functie voor het indienen van de factuur
    const onSubmit = async (data) => {
        try {
            // Voer de validatie voor alle regels uit
            data.lines.forEach((line, index) => {
                validateLine(line, index);
            });

            // Bouw de payload voor de API-aanroep
            const lines = data.lines.map((line) => {
                const base = {
                    description: line.description,
                    date: line.date || null,
                };

                if (line.amount) return {...base, amount: parseFloat(line.amount)};
                if (line.type === "time") return {
                    ...base,
                    durationMinutes: parseInt(line.durationMinutes),
                    hourlyRate: parseFloat(line.hourlyRate)
                };
                if (line.type === "travel") return {
                    ...base,
                    distanceKm: parseInt(line.distanceKm),
                    ratePerKm: parseFloat(line.ratePerKm)
                };

                return base;
            });

            const invoicePayload = {
                invoiceNumber: data.invoiceNumber || null,
                invoiceDate: data.invoiceDate || null,
                clientId: parseInt(data.clientId),
                lines,
            };

            console.log("Verstuurd payload:", JSON.stringify(invoicePayload, null, 2));

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/invoices`, invoicePayload);
            const invoice = response.data;
            setCreatedInvoice(invoice);
            alert(`Invoice created: ${invoice.invoiceNumber}`);
            reset();
        } catch (err) {
            console.error("Failed to create invoice", err);
            alert(err.message || "Error creating invoice");
        }
    };

    const handleOpenClick = () => {
        const driveUrl = createdInvoice.driveUrl;

        if (driveUrl) {
            window.open(driveUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert("De PDF-link is niet beschikbaar.");
        }
    };

    return (
        <div>
            <h3>Factuur aanmaken</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Factuur Gegevens */}
                <fieldset>
                    <legend>Factuurgegevens</legend>

                    <label htmlFor="invoiceNumber">Factuurnummer</label>
                    <input
                        id="invoiceNumber"
                        type="text"
                        {...register("invoiceNumber")}
                        placeholder="Laat leeg voor automatisch aanmaken"
                    />

                    <label htmlFor="invoiceDate">Factuurdatum</label>
                    <input
                        id="invoiceDate"
                        type="date"
                        {...register("invoiceDate")}
                    />

                    <label htmlFor="clientId">Klant</label>
                    <select id="clientId" {...register("clientId")} required>
                        <option value="">-- Kies klant --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name} ({client.contactPerson})
                            </option>
                        ))}
                    </select>
                </fieldset>

                <fieldset>
                    <legend>Factuurregels</legend>
                    {fields.map((field, index) => {
                        const watchedLine = watchedLines?.[index] || {};
                        const type = watchedLine.type || "time";

                        return (
                            <div key={field.id}>
                                <input
                                    type="hidden"
                                    {...register(`lines.${index}.type`)}
                                />

                                <input
                                    type="text"
                                    {...register(`lines.${index}.description`)}
                                    placeholder="Omschrijving"
                                />

                                <input
                                    type="date"
                                    {...register(`lines.${index}.date`)}
                                />

                                {type === "time" && (
                                    <>
                                        <input
                                            type="number"
                                            {...register(`lines.${index}.durationMinutes`)}
                                            placeholder="Duur (minuten)"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`lines.${index}.hourlyRate`)}
                                            placeholder="Uurtarief (€)"
                                        />
                                    </>
                                )}

                                {type === "travel" && (
                                    <>
                                        <input
                                            type="number"
                                            {...register(`lines.${index}.distanceKm`)}
                                            placeholder="Afstand (km)"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`lines.${index}.ratePerKm`)}
                                            placeholder="Tarief per km (€)"
                                        />
                                    </>
                                )}

                                <input
                                    type="number"
                                    step="0.01"
                                    {...register(`lines.${index}.amount`)}
                                    placeholder="Totaalbedrag (€)"
                                />

                                <Button
                                    type="button"
                                    variant="simple"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    Verwijder regel
                                </Button>
                            </div>
                        );
                    })}

                    <Button
                        type="button"
                        variant="simple"
                        onClick={() => handleAddLine("time")}
                    >
                        + Regel toevoegen (Uren)
                    </Button>

                    <Button
                        type="button"
                        variant="simple"
                        onClick={() => handleAddLine("travel")}
                    >
                        + Reiskosten toevoegen
                    </Button>
                </fieldset>

                <Button type="submit">Genereer factuur</Button>
            </form>

            {/* PDF Link */}
            {createdInvoice && (
                <div>
                    <p><strong>Factuurnummer:</strong> {createdInvoice.invoiceNumber}</p>
                    <Button onClick={handleOpenClick}>
                        Open PDF
                    </Button>
                </div>
            )}
        </div>
    );
}

export default CreateInvoiceForm;