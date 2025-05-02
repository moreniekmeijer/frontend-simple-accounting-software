import React, {useEffect, useState} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import axios from "axios";

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


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Invoice Number</label>
                    <input type="text" {...register("invoiceNumber")} />
                </div>

                <div>
                    <label>Invoice Date</label>
                    <input type="date" {...register("invoiceDate")} />
                </div>

                <div>
                    <label>Client</label>
                    <select {...register("clientId")} required>
                        <option value="">-- Choose client --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name} ({client.contactPerson})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Invoice Lines</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border p-2 my-2">
                            <input
                                placeholder="Description"
                                {...register(`lines.${index}.description`)}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date"
                                {...register(`lines.${index}.date`)}
                            />
                            <input
                                type="number"
                                placeholder="Minutes"
                                {...register(`lines.${index}.durationMinutes`)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Hourly rate"
                                {...register(`lines.${index}.hourlyRate`)}
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Amount (€)"
                                {...register(`lines.${index}.amount`)}
                                required
                            />
                            <button type="button" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({description: "", amount: ""})}>
                        + Add Line
                    </button>
                </div>

                <button type="submit">Create Invoice</button>
            </form>
            {createdInvoice && (
                <div className="mt-4">
                    <p><strong>Factuurnummer:</strong> {createdInvoice.invoiceNumber}</p>
                    <a
                        href={`${import.meta.env.VITE_API_URL}/invoices/${createdInvoice.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mt-2 inline-block"
                    >
                        Download PDF
                    </a>
                </div>
            )}
        </div>
    );
}

export default CreateInvoiceForm;
