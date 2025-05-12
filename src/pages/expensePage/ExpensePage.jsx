import {useState, useEffect, useRef} from "react";
import axios from "axios";
import {useForm} from "react-hook-form";
import DragDrop from "../../components/dragDrop/DragDrop.jsx";
import Button from "../../components/button/Button.jsx";
import OpenPdfButton from "../../components/openPdfButton/OpenPdfButton.jsx";
import styles from "./ExpensePage.module.css";
import LoadingIcon from "../../components/loadingIcon/LoadingIcon.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpenseId, setSelectedExpenseId] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isInvestment, setIsInvestment] = useState(null);
    const [createdExpense, setCreatedExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dropRef = useRef();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {errors}
    } = useForm();

    const amountValue = watch("amount");

    useEffect(() => {
        void fetchAllExpenses();
    }, []);

    useEffect(() => {
        const parsedAmount = parseFloat(amountValue);
        if (!isNaN(parsedAmount) && parsedAmount > 450) {
            setIsInvestment(true);
            setValue("category", "investering");
        } else {
            setIsInvestment(false);
            setValue("category", "");
        }
    }, [amountValue, setValue]);

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
                headers: {'Content-Type': 'multipart/form-data'}
            });
            reset(response.data);
        } catch (error) {
            console.error("Fout bij uploaden OCR:", error);
            alert("Upload van OCR mislukt.");
        }
    };

    const handleExpenseSelect = async (id) => {
        setSelectedExpenseId(id);

        if (!id) {
            reset();
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/${id}`);
            const expense = response.data;
            reset(expense);
            setCreatedExpense(expense);
        } catch (error) {
            console.error("Fout bij ophalen van expense:", error);
            alert("Kan expense niet ophalen.");
        }
    };

    const onSubmit = async (data) => {
        if (!uploadedFile) {
            alert("Geen bestand geselecteerd.");
            return;
        }

        const formData = new FormData();
        formData.append("expense", new Blob([JSON.stringify(data)], {type: "application/json"}));
        formData.append("file", uploadedFile);

        if (isInvestment) {
            const investmentData = {
                depreciationYears: data.depreciationYears,
                residualValue: data.residualValue
            };
            formData.append("investment", new Blob([JSON.stringify(investmentData)], {type: "application/json"}));
        }

        setIsLoading(true);
        try {
            const response = await axios.post(API_URL, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });

            const expense = response.data;
            setCreatedExpense(expense);
            alert("Bon succesvol opgeslagen.");
            reset();
            setUploadedFile(null);
            void fetchAllExpenses();
        } catch (error) {
            console.error("Fout bij opslaan:", error);
            alert("Opslaan mislukt.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3>Uitgave toevoegen of bewerken</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <DragDrop ref={dropRef} onFileSelect={handleFileSelect}/>

                    <label className={styles.chooseExpense}>
                        Of kies een bestaande bon:
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
                    </label>

                    {createdExpense && createdExpense.driveUrl && (
                        <OpenPdfButton
                            driveUrl={createdExpense.driveUrl}
                            invoiceNumber={createdExpense.invoiceNumber}
                        />
                    )}
                </fieldset>

                <fieldset>
                    <legend>Uitgave details</legend>
                    <label>
                        Factuurnummer
                        <input
                            type="text"
                            {...register("invoiceNumber", {required: "Verplicht veld"})}
                        />
                    </label>
                    {errors.invoiceNumber && <p>{errors.invoiceNumber.message}</p>}

                    <label>
                        Datum
                        <input
                            type="date"
                            {...register("date", {required: "Datum is verplicht"})}
                        />
                    </label>
                    {errors.date && <p>{errors.date.message}</p>}

                    <label>
                        Bedrijf
                        <input
                            type="vendor"
                            {...register("vendor", {required: "Bedrijf is verplicht"})}
                        />
                    </label>
                    {errors.date && <p>{errors.date.message}</p>}

                    <label>
                        Bedrag
                        <input
                            type="text"
                            {...register("amount", {
                                required: "Bedrag is verplicht",
                                validate: val => !isNaN(val) || "Moet een getal zijn"
                            })}
                        />
                    </label>
                    {errors.amount && <p>{errors.amount.message}</p>}

                    <label>
                        BTW
                        <input
                            type="text"
                            {...register("vat", {
                                required: "BTW is verplicht",
                                validate: val => !isNaN(val) || "Moet een getal zijn"
                            })}
                            defaultValue="0.21"
                        />
                    </label>
                    {errors.vat && <p>{errors.vat.message}</p>}

                    <label>
                        Categorie
                        <input
                            type="text"
                            {...register("category")}
                            disabled={isInvestment}
                        />
                    </label>
                </fieldset>

                {isInvestment && (
                    <fieldset>
                        <legend>Investeringsdetails</legend>
                        <label>
                            Afschrijvingsduur (jaren)
                            <input
                                type="number"
                                {...register("depreciationYears", {
                                    required: "Verplicht bij investeringen",
                                    min: {value: 5, message: "Minimaal 5 jaar"}
                                })}
                                defaultValue="5"
                            />
                        </label>
                        {errors.depreciationYears && <p>{errors.depreciationYears.message}</p>}

                        <label>
                            Restwaarde (€)
                            <input
                                type="number"
                                step="0.01"
                                {...register("residualValue", {
                                    required: "Verplicht bij investeringen",
                                    min: {value: 0, message: "Kan niet negatief zijn"}
                                })}
                                defaultValue="0"
                            />
                        </label>
                        {errors.residualValue && <p>{errors.residualValue.message}</p>}
                    </fieldset>
                )}

                {isLoading ? <LoadingIcon type="cart"/> : <Button type="submit">Bijwerken</Button>}
            </form>
        </div>
    );
};

export default ExpensePage;