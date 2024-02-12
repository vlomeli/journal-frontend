import { API_URL } from "../environment";
import { getJwt } from "./JwtService";

export const createEntry = async (body) => {
    const response = await fetch(`${API_URL}/entry_table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwt()}`
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();

    return data;
}

export const getUserEntries = async () => {
    const response = await fetch(`${API_URL}/entry_table`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getJwt()}`
        },
    });
    const data = await response.json();

    return data;
}


//add try catch blocks when you have time