const BASE_URL = "https://6a1bcc418858a003817b3d04.mockapi.io/api/Products";

export default class ApiServices {
    getProducts = () => {
        return axios({
            url: BASE_URL,
            method: "GET",
        })
    }
}