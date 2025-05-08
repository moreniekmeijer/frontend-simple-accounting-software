import React from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import Button from "../button/Button.jsx";

const API_URL = `${import.meta.env.VITE_API_URL}/investments`;

const InvestmentForm = ({expenseId, onSuccess}) => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm();

    console.log(expenseId)

    const onSubmit = async (data) => {
        try {
            await axios.post(API_URL, data, {
                params: {
                    expenseId: expenseId
                }
            });
            reset();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Fout bij opslaan investering:", err);
            alert("Opslaan mislukt. Probeer opnieuw.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Investeringgegevens</h4>

            <fieldset>
                <label>Afschrijvingsduur (jaren)</label>
                <input
                    type="number"
                    step="1"
                    {...register("depreciationYears", {
                        required: "Afschrijvingsduur is verplicht",
                        min: {value: 1, message: "Minimaal 1 jaar"},
                    })}
                />
                {errors.depreciationYears && (
                    <p style={{color: "red"}}>{errors.depreciationYears.message}</p>
                )}

                <label>Restwaarde (€)</label>
                <input
                    type="number"
                    step="0.01"
                    {...register("residualValue", {
                        required: "Restwaarde is verplicht",
                        min: {value: 0, message: "Restwaarde kan niet negatief zijn"},
                    })}
                />
                {errors.residualValue && (
                    <p style={{color: "red"}}>{errors.residualValue.message}</p>
                )}

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Opslaan..." : "Investering opslaan"}
                </Button>
            </fieldset>
        </form>
    );
};

export default InvestmentForm;
