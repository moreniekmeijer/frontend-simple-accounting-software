import React, {useEffect, useState} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from "axios";
import Button from "../button/Button.jsx";

function CreateInvoiceForm() {
    const {register, control, handleSubmit, reset} = useForm({
        defaultValues: {
            invoiceNumber: "",
            invoiceDate: "",
            clientId: "",
            lines: [{description: "", date: "", durationMinutes: "", hourlyRate: "", amount: ""}],
        },
    });

    const {fields, append, remove} = useFieldArray({control, name: "lines"});
    const [clients, setClients] = useState([]);
    const [createdInvoice, setCreatedInvoice] = useState(null);

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

    const onSubmit = async (data) => {
        try {
            const invoicePayload = {
                invoiceNumber: data.invoiceNumber || null,
                invoiceDate: data.invoiceDate || null,
                clientId: parseInt(data.clientId),
                lines: data.lines.map(line => ({
                    description: line.description,
                    date: line.date || null,
                    durationMinutes: line.durationMinutes ? parseInt(line.durationMinutes) : null,
                    hourlyRate: line.hourlyRate ? parseFloat(line.hourlyRate) : null,
                    amount: parseFloat(line.amount)
                }))
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/invoices`, invoicePayload);
            const invoice = response.data;
            setCreatedInvoice(invoice);
            alert(`Invoice created: ${invoice.invoiceNumber}`);
            reset();
        } catch (err) {
            console.error("Failed to create invoice", err);
            alert("Error creating invoice");
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
                <fieldset>
                    <label>Factuurnummer</label>
                    <input
                        type="text"
                        {...register("invoiceNumber")}
                        placeholder="Laat leeg voor automatisch aanmaken"
                    />

                    <label>Factuurdatum</label>
                    <input
                        type="date"
                        {...register("invoiceDate")}
                        defaultValue={Date.now()}
                    />

                    <label>Klant</label>
                    <select {...register("clientId")} required>
                        <option value="">-- Kies klant --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name} ({client.contactPerson})
                            </option>
                        ))}
                    </select>
                </fieldset>

                <fieldset>
                    <label>Factuur regels</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border p-2 my-2">
                            <input
                                placeholder="Omschrijving"
                                {...register(`lines.${index}.description`)}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Datum"
                                {...register(`lines.${index}.date`)}
                            />
                            <input
                                type="number"
                                placeholder="Minuten"
                                {...register(`lines.${index}.durationMinutes`)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Uurtarief"
                                {...register(`lines.${index}.hourlyRate`)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Bedrag (€)"
                                {...register(`lines.${index}.amount`)}
                                required
                            />
                            <Button type="button" variant="simple" onClick={() => remove(index)}>Verwijder</Button>
                        </div>
                    ))}
                    <Button type="button" variant="simple" onClick={() => append({description: "", amount: ""})}>
                        + Regel toevoegen
                    </Button>
                </fieldset>

                <Button type="submit">Genereer factuur</Button>
            </form>
            {createdInvoice && (
                <div>
                    <p><strong>Factuurnummer:</strong> {createdInvoice.invoiceNumber}</p>
                    <Button
                        onClick={handleOpenClick}
                    >
                        Open PDF
                    </Button>
                </div>
            )}
        </div>
    );
}

export default CreateInvoiceForm;
