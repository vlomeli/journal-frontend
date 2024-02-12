const jwtKey = 'journal-app-jwt';

export const setJWT = (jwt) => {
    localStorage.setItem(jwtKey, jwt);
}

export const getJwt = () => {
   const jwt = localStorage.getItem(jwtKey);

   return jwt;
}

export const removeJwt = () => {
    localStorage.removeItem(jwtKey);
}