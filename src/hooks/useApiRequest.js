import { useState } from 'react';
import axios from 'axios';

const useApiRequest = (defaultData = null) => {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeRequest = async (method, url, requestData = null, queryParams = null) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Geen token gevonden');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            if (!(requestData instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }

            const config = {
                headers,
                params: queryParams || {},
            };

            let response;
            switch (method.toLowerCase()) {
                case 'get':
                    response = await axios.get(url, config);
                    break;
                case 'post':
                    response = await axios.post(url, requestData, config);
                    break;
                case 'put':
                    response = await axios.put(url, requestData, config);
                    break;
                case 'delete':
                    response = await axios.delete(url, config);
                    break;
                default:
                    throw new Error(`Ongeldige methode: ${method}`);
            }

            setData(response.data ?? defaultData);
            return response;

        } catch (error) {
            console.error("API request error:", error.response);
            setError(error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, executeRequest };
};

export default useApiRequest;
