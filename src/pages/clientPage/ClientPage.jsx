import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function ClientPage() {
    const [clients, setClients] = useState([]);
    const [editClientId, setEditClientId] = useState(null);

    const { register, handleSubmit, reset, setValue } = useForm({
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
            <h1>{editClientId ? "Edit Client" : "Add Client"}</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: true })} placeholder="Name" />
                <input {...register("contactPerson")} placeholder="Contact Person" />
                <input {...register("street")} placeholder="Street" />
                <input {...register("postalCode")} placeholder="Postal Code" />
                <input {...register("city")} placeholder="City" />
                <button type="submit">{editClientId ? "Update" : "Add"}</button>
                {editClientId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
            </form>

            <h2>Client List</h2>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>
                        <strong>{client.name}</strong> ({client.contactPerson}) – {client.city}
                        <button onClick={() => handleEdit(client)}>Edit</button>
                        <button onClick={() => handleDelete(client.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientPage;
