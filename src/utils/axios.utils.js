

// Axios Interceptor
import axios from "axios";

const client = axios.create({baseURL:'http://localhost:4000'});

export const request =({...Option})=>{

client.defaults.headers.common.Authorization = `Bearer token`;

const onSuccess=response => response;
const onError = error =>{
    //Optionally catch errors and add additional logging here
    return error; 
}
return client(Option).then(onSuccess).catch(onError); 
}