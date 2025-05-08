import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import Button from "../../components/button/Button.jsx";

function ClientPage() {
    const [clients, setClients] = useState([]);
    const [editClientId, setEditClientId] = useState(null);

    const {register, handleSubmit, reset, setValue} = useForm({
        defaultValues: {
            name: "",
            contactPerson: "",
            street: "",
            postalCode: "",
            city: ""
        }
    });

    useEffect(() => {
        void fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients`);
            setClients(res.data);
        } catch (err) {
            console.error("Failed to load clients", err);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editClientId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/clients/${editClientId}`, data);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/clients`, data);
            }
            reset();
            setEditClientId(null);
            void fetchClients();
        } catch (err) {
            console.error("Failed to save client", err);
        }
    };

    const handleEdit = (client) => {
        setEditClientId(client.id);
        setValue("name", client.name);
        setValue("contactPerson", client.contactPerson);
        setValue("street", client.street);
        setValue("postalCode", client.postalCode);
        setValue("city", client.city);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/clients/${id}`);
            fetchClients();
        } catch (err) {
            console.error("Failed to delete client", err);
        }
    };

    const handleCancelEdit = () => {
        reset();
        setEditClientId(null);
    };

    return (
        <div>
            <h3>{editClientId ? "Klant aanpassen" : "Klant toevoegen"}</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <input {...register("name", {required: true})} placeholder="Naam"/>
                    <input {...register("contactPerson")} placeholder="Contactpersoon"/>
                    <input {...register("street")} placeholder="Straat"/>
                    <input {...register("postalCode")} placeholder="Postcode"/>
                    <input {...register("city")} placeholder="Stad"/>
                    <Button type="submit">{editClientId ? "Bijwerken" : "Toevoegen"}</Button>
                    {editClientId && <Button type="button" variant="simple" onClick={handleCancelEdit}>Cancel</Button>}
                </fieldset>
            </form>

            <h4>Client List</h4>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>
                        <strong>{client.name}</strong> ({client.contactPerson}) – {client.city}
                        <Button variant="simple" onClick={() => handleEdit(client)}>Bewerk</Button>
                        <Button variant="simple" onClick={() => handleDelete(client.id)}>Verwijder</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientPage;
