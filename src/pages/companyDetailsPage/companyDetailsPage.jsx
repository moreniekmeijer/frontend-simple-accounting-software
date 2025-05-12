import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import Button from "../../components/button/Button.jsx";
import {yupResolver} from "@hookform/resolvers/yup/src/index.js";
import * as Yup from "yup";

const validationSchema = Yup.object({
    name: Yup.string().required('Naam is verplicht'),
    street: Yup.string().required('Straat is verplicht'),
    postalCode: Yup.string().required('Postcode is verplicht'),
    city: Yup.string().required('Woonplaats is verplicht'),
    phone: Yup.string().matches(/^\+?[0-9]{10,15}$/, 'Telefoonnummer is ongeldig').required('Telefoon is verplicht'),
    email: Yup.string().email('Email is ongeldig').required('Email is verplicht'),
    iban: Yup.string().matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, 'IBAN is ongeldig').required('IBAN is verplicht'),
    vatId: Yup.string().required('BTW-ID is verplicht'),
    kvk: Yup.string().required('KvK-nummer is verplicht')
}).required();

export default function CompanyDetailsPage() {
    const {register, handleSubmit, formState: {errors, isSubmitting, isDirty}, reset} = useForm({
        resolver: yupResolver(validationSchema),
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/company`);
                reset(response.data);
            } catch (err) {
                if (err.response?.status !== 404) {
                    setError('Fout bij ophalen gegevens.');
                }
            } finally {
                setLoading(false);
            }
        };

        void fetchCompanyDetails();
    }, [reset]);

    const onSubmit = async (data) => {
        setSaved(false);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/company`, data);
            setSaved(true);
        } catch (error) {
            setError('Opslaan mislukt.');
            console.error(error);
        }
    };

    if (loading) return <p>Bezig met laden...</p>;
    if (error) return <p>{error}</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Bedrijfsgegevens</h3>

            <fieldset>
                <label>
                    Naam
                    <input {...register('name')} />
                </label>
                {errors.name && <p>{errors.name.message}</p>}

                <label>
                    Straat
                    <input {...register('street')} />
                </label>
                {errors.street && <p>{errors.street.message}</p>}

                <label>
                    Postcode
                    <input {...register('postalCode')} />
                </label>
                {errors.postalCode && <p>{errors.postalCode.message}</p>}

                <label>
                    Woonplaats
                    <input {...register('city')} />
                </label>
                {errors.city && <p>{errors.city.message}</p>}

                <label>
                    Telefoon
                    <input {...register('phone')} />
                </label>
                {errors.phone && <p>{errors.phone.message}</p>}

                <label>
                    Email
                    <input {...register('email')} />
                </label>
                {errors.email && <p>{errors.email.message}</p>}

                <label>
                    IBAN
                    <input {...register('iban')} />
                </label>
                {errors.iban && <p>{errors.iban.message}</p>}

                <label>
                    BTW-ID
                    <input {...register('vatNumber')} />
                </label>
                {errors.vatNumber && <p>{errors.vatNumber.message}</p>}

                <label>
                    KvK-nummer
                    <input {...register('chamberOfCommerce')} />
                </label>
                {errors.chamberOfCommerce && <p>{errors.chamberOfCommerce.message}</p>}

                <Button type="submit" disabled={isSubmitting || !isDirty}>
                    Opslaan
                </Button>

                {saved && <p>Gegevens opgeslagen!</p>}</fieldset>
        </form>
    );
}