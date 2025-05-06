import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import DragDrop from "../../components/dragDrop/DragDrop.jsx";
import Button from "../../components/button/Button.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpenseId, setSelectedExpenseId] = useState("");
    const [currentExpenseId, setCurrentExpenseId] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    const dropRef = useRef();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        void fetchAllExpenses();
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
        setUploadedFile(file);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await axios.post(`${API_URL}/parse`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            reset(response.data); // parsedReceiptDto
            setCurrentExpenseId(null); // dit is een NIEUWE bon
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
            setReceiptUrl("");  // Als er geen selectie is, reset de afbeelding
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${id}`);
            reset(response.data);

            // Haal de bonafbeelding op van de backend
            const receiptResponse = await axios.get(`${API_URL}/${id}/receipt`, { responseType: 'blob' });
            const imageUrl = URL.createObjectURL(receiptResponse.data);  // Zet de blob om naar een URL
            setReceiptUrl(imageUrl);
        } catch (error) {
            console.error("Fout bij ophalen bon:", error);
            alert("Bon niet gevonden.");
        }
    };

    const onSubmit = async (data) => {
        if (!uploadedFile) {
            alert("Geen bestand geselecteerd.");
            return;
        }

        const formData = new FormData();
        formData.append("expense", new Blob([JSON.stringify(data)], { type: "application/json" }));
        formData.append("file", uploadedFile);

        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Bon succesvol opgeslagen.");
            reset();
            setUploadedFile(null);
            void fetchAllExpenses();
        } catch (error) {
            console.error("Fout bij opslaan:", error);
            alert("Opslaan mislukt.");
        }
    };

    const handleDownload = async () => {
        if (!currentExpenseId) return;
        try {
            const response = await axios.get(`${API_URL}/${currentExpenseId}/receipt`, { responseType: 'blob' });
            const file = new Blob([response.data], { type: 'application/pdf' }); // of een andere mime type
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = 'receipt.pdf';  // Pas naam aan indien nodig
            link.click();
        } catch (error) {
            console.error("Fout bij downloaden bon:", error);
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

            {receiptUrl && (
                <div>
                    <h4>Bonafbeelding</h4>
                    <img src={receiptUrl} alt="Receipt" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                    <Button onClick={handleDownload}>Download bon</Button>
                </div>
            )}

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

                <Button type="submit">Bijwerken</Button>
            </form>
        </div>
    );
};

export default ExpensePage;