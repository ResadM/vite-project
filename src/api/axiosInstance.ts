import axios, { AxiosResponse } from "axios";
import { PaginateResponse } from "../models/Pagination";

//Sets the base URL for all API requests
axios.defaults.baseURL = 'https://localhost:44354/'

//Extracts and returns the data property from the Axios response.
const responseBody = (response: AxiosResponse) => response.data;

//Request configuration
axios.interceptors.request.use((config) => {
    //You can configure request header. e.g. : Add token or add support language to request.    
    return config;
});

//Response configuration
axios.interceptors.response.use((response) => {
    //Extracts pagination and data from the response.
    const pagination = response.headers["pagination"];
    if (pagination)
    {
        response.data = new PaginateResponse(
            response.data,
            JSON.parse(pagination)
        );
        return response;
        }
    return response;
},
    (error) => {
        //Handling response error
        console.log(error);
    }
)

const requests = {
    get: (url: string, params?: URLSearchParams, cancelToken?: any) =>
        axios.get(url, { params, cancelToken }).then(responseBody)
};

export default requests;



