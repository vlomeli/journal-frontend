import { API_URL } from "../environment";
import { getJwt } from "./JwtService";

//making a POST HTTP request to the Endpoint containing the corresponding db table to create an entry.
export const createEntry = async (body) => {  // body is a parameter which is an object representing the data that is being added
    const response = await fetch(`${API_URL}/entry_table`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',     // request body is in JSON format
            Authorization: `Bearer ${getJwt()}`     // contains jwt token
        },
        body: JSON.stringify(body)                  // body is being turned into a string
    });
    const data = await response.json();             // parses the JSON data from the response & stores in data variable

    return data;           // function returns the parsed JSON data from the response
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

export const deleteEntry = async (entryId) => {
    const response = await fetch(`${API_URL}/entry_table/${entryId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getJwt()}`
        },
    });
    const data = await response.json();

    return data;
}

export const updateEntry = async (body) => {
    const response = await fetch(`${API_URL}/entry_table`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwt()}`
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();

    return data;
}

export const getUsername = async () => {
    const response = await fetch(`${API_URL}/user_table`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getJwt()}`
        },
    });
    const data = await response.json();

    return data;
}


//add try catch blocks when you have time