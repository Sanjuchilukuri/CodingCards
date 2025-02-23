import axios from "axios";

const Api = axios.create({
    baseURL:"https://coding-cards.vercel.app/"
});

export default Api;