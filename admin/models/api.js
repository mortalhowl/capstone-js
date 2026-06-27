const API_URL = "https://6a1bcc418858a003817b3d04.mockapi.io/api/Products";

class Api {
  fetchPhoneList() {
    return axios({
      url: API_URL,
      method: "GET"
    });
  }

  getPhoneById(id) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "GET"
    });
  }

  addPhone(phone) {
    return axios({
      url: API_URL,
      method: "POST",
      data: phone
    });
  }

  updatePhone(id, phone) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "PUT",
      data: phone
    });
  }

  deletePhone(id) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "DELETE"
    });
  }
}

export default Api;