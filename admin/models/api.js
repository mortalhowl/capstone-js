const API_URL = "https://6a2a32c1f59cb8f65f1e2d8c.mockapi.io/Products";

class Api {
  // 1. Lấy toàn bộ danh sách điện thoại từ MockAPI
  fetchPhoneList() {
    return axios({
      url: API_URL,
      method: "GET"
    });
  }

  // 2. Lấy thông tin chi tiết một chiếc điện thoại dựa vào ID
  getPhoneById(id) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "GET"
    });
  }

  // 3. Thêm mới một sản phẩm điện thoại
  addPhone(phone) {
    return axios({
      url: API_URL,
      method: "POST",
      data: phone
    });
  }

  // 4. Cập nhật thông tin điện thoại qua ID
  updatePhone(id, phone) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "PUT",
      data: phone
    });
  }

  // 5. Xóa điện thoại khỏi danh sách
  deletePhone(id) {
    return axios({
      url: `${API_URL}/${id}`,
      method: "DELETE"
    });
  }
}

export default Api;