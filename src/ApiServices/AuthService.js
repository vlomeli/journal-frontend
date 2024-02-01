//need to create function for every endpoint
import {API_URL} from '../environment';

export const register = async (body) => {

    console.log('body', body)

 const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify(body)
 });


 const data = await response.json();

 return data;
}