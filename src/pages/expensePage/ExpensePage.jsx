import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import DragDrop from "../../components/dragDrop/DragDrop.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

// TODO - /expense wordt nu al opgeslagen voordat de gebruiker de data heeft gecheckt! Dat moet niet

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpenseId, setSelectedExpenseId] = useState("");
    const [currentExpenseId, setCurrentExpenseId] = useState(null);

    const dropRef = useRef();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        fetchAllExpenses();
    }, []);

    const fetchAllExpenses = async () => {
        try {
            const response = await axios.get(API_URL);
            setExpenses(response.data);
        } catch (error) {
            console.error("Fout bij ophalen van expenses:", error);
        }
    };

    const handleFileSelect = async (file) => {
        setSelectedExpenseId("");
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await axios.post(API_URL, uploadData);
            reset(response.data);
            setCurrentExpenseId(response.data.id);
        } catch (error) {
            console.error("Fout bij uploaden of OCR:", error);
            alert("Upload of OCR mislukt.");
        }
    };

    const handleExpenseSelect = async (id) => {
        setSelectedExpenseId(id);
        setCurrentExpenseId(id);

        if (!id) {
            reset();
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${id}`);
            reset(response.data);
        } catch (error) {
            console.error("Fout bij ophalen bon:", error);
            alert("Bon niet gevonden.");
        }
    };

    const onSubmit = async (data) => {
        if (!currentExpenseId) {
            alert("Geen bon geselecteerd of geüpload.");
            return;
        }

        try {
            await axios.put(`${API_URL}/${currentExpenseId}`, data);
            alert("Bon succesvol bijgewerkt.");
            fetchAllExpenses();
        } catch (error) {
            console.error("Fout bij bijwerken:", error);
            alert("Bijwerken mislukt.");
        }
    };

    return (
        <div>
            <h3>Uitgave toevoegen of bewerken</h3>

            <div>
                <label>Sleep je bon hierheen of klik:</label>
                <DragDrop ref={dropRef} onFileSelect={handleFileSelect} />
            </div>

            <div>
                <label>Kies een bestaande bon:</label>
                <select
                    value={selectedExpenseId}
                    onChange={(e) => handleExpenseSelect(e.target.value)}
                >
                    <option value="">-- Selecteer een bon --</option>
                    {expenses.map(exp => (
                        <option key={exp.id} value={exp.id}>
                            {exp.invoiceNumber || "Zonder nummer"} ({exp.date})
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Factuurnummer</label>
                    <input
                        type="text"
                        {...register("invoiceNumber", { required: "Verplicht veld" })}
                    />
                    {errors.invoiceNumber && <p>{errors.invoiceNumber.message}</p>}
                </div>

                <div>
                    <label>Datum</label>
                    <input
                        type="date"
                        {...register("date", { required: "Datum is verplicht" })}
                    />
                    {errors.date && <p>{errors.date.message}</p>}
                </div>

                <div>
                    <label>Bedrag</label>
                    <input
                        type="text"
                        {...register("amount", {
                            required: "Bedrag is verplicht",
                            validate: val => !isNaN(val) || "Moet een getal zijn"
                        })}
                    />
                    {errors.amount && <p>{errors.amount.message}</p>}
                </div>

                <div>
                    <label>BTW</label>
                    <input
                        type="text"
                        {...register("vat", {
                            required: "BTW is verplicht",
                            validate: val => !isNaN(val) || "Moet een getal zijn"
                        })}
                    />
                    {errors.vat && <p>{errors.vat.message}</p>}
                </div>

                <div>
                    <label>Categorie</label>
                    <input
                        type="text"
                        {...register("category")}
                    />
                </div>

                <button type="submit">Bijwerken</button>
            </form>
        </div>
    );
};

export default ExpensePage;
