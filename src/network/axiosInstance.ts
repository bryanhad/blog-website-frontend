import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 5000, //if our server doesn't response in 5sec, the request will be aborted.
})

// in axios, if the result is of 400 or 500, the result then is automatically thrown as an error.. nice!

export default axiosInstance