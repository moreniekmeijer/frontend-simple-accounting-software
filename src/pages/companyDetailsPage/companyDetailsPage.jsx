import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
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
    const { register, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm({
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
            <h1>Bedrijfsgegevens</h1>

            <div>
                <label htmlFor="name">Naam</label>
                <input id="name" {...register('name')} />
                {errors.name && <p>{errors.name.message}</p>} {/* Toon foutmelding */}
            </div>

            <div>
                <label htmlFor="street">Straat</label>
                <input id="street" {...register('street')} />
                {errors.street && <p>{errors.street.message}</p>}
            </div>

            <div>
                <label htmlFor="postalCode">Postcode</label>
                <input id="postalCode" {...register('postalCode')} />
                {errors.postalCode && <p>{errors.postalCode.message}</p>}
            </div>

            <div>
                <label htmlFor="city">Woonplaats</label>
                <input id="city" {...register('city')} />
                {errors.city && <p>{errors.city.message}</p>}
            </div>

            <div>
                <label htmlFor="phone">Telefoon</label>
                <input id="phone" {...register('phone')} />
                {errors.phone && <p>{errors.phone.message}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input id="email" {...register('email')} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="iban">IBAN</label>
                <input id="iban" {...register('iban')} />
                {errors.iban && <p>{errors.iban.message}</p>}
            </div>

            <div>
                <label htmlFor="vatId">BTW-ID</label>
                <input id="vatId" {...register('vatId')} />
                {errors.vatId && <p>{errors.vatId.message}</p>}
            </div>

            <div>
                <label htmlFor="kvk">KvK-nummer</label>
                <input id="kvk" {...register('kvk')} />
                {errors.kvk && <p>{errors.kvk.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting || !isDirty}>
                Opslaan
            </Button>

            {saved && <p>Gegevens opgeslagen!</p>}
        </form>
    );
}