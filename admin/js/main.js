import Phone from "../models/phone.js";
import Validation from "../models/Validation.js";
import Api from "../models/api.js";

const validation = new Validation();
const api = new Api();

let phoneListLocal = []; 
let currentEditId = null; 

function getId(id) {
  return document.getElementById(id);
}

function getPhoneList() {
  api.fetchPhoneList()
    .then((res) => {
      phoneListLocal = res.data;
      renderListPhone(phoneListLocal);
    })
    .catch((err) => console.error("Lỗi lấy danh sách sản phẩm từ API: ", err));
}

function renderListPhone(list) {
  let contentHTML = "";
  const tableBody = getId("tablePhone");
  if (!tableBody) return;

  if (!list || list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-12 text-gray-400 text-center">Không tìm thấy sản phẩm nào!</td></tr>`;
    return;
  }

  list.forEach((item, index) => {
    const phone = Object.assign(new Phone(), item);

    contentHTML += `
      <tr class="bg-white border-b hover:bg-gray-50 text-center text-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900">${index + 1}</td>
        <td class="px-6 py-4 font-semibold text-gray-900">${phone.name}</td>
        <td class="px-6 py-4 text-red-500 font-bold">$${Number(phone.price).toLocaleString()}</td>
        <td class="px-6 py-4 flex justify-center">
          <img src="${phone.img}" alt="${phone.name}" class="w-16 h-16 object-cover rounded-md shadow" onerror="this.src='https://placehold.co/60x60?text=No+Image'">
        </td>
        <td class="px-6 py-4 max-w-xs truncate text-left">${phone.desc}</td>
        <td class="px-6 py-4 space-x-2">
          <button data-id="${phone.id}" class="btn-edit bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded transition shadow">Sửa</button>
          <button data-id="${phone.id}" class="btn-delete bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded transition shadow">Xóa</button>
        </td>
      </tr>`;
  });
  tableBody.innerHTML = contentHTML;
}

function getInfoPhone() {
  const name = getId("name").value.trim();
  const price = getId("price").value.trim();
  const screen = getId("screen").value.trim();
  const backCamera = getId("backCamera").value.trim();
  const frontCamera = getId("frontCamera").value.trim();
  const img = getId("img").value.trim();
  const desc = getId("desc").value.trim();
  const brand = getId("brand").value;

  let isValid = true;

  isValid &= validation.checkEmpty(name, "tbName", "(*) Tên điện thoại không được bỏ trống");
  
  isValid &= validation.checkEmpty(price, "tbPrice", "(*) Giá tiền không được bỏ trống");
  if (price !== "" && (isNaN(price) || Number(price) <= 0)) {
    getId("tbPrice").innerHTML = "(*) Giá tiền phải là số lớn hơn 0";
    getId("tbPrice").classList.remove("hidden");
    isValid = false;
  }

  isValid &= validation.checkEmpty(screen, "tbScreen", "(*) Thông tin màn hình không được bỏ trống");
  isValid &= validation.checkEmpty(backCamera, "tbBCam", "(*) Camera sau không được bỏ trống");
  isValid &= validation.checkEmpty(frontCamera, "tbFCam", "(*) Camera trước không được bỏ trống");
  
  isValid &= validation.checkEmpty(img, "tbImg", "(*) Đường dẫn ảnh không được bỏ trống");
  if (img !== "" && !img.startsWith("http://") && !img.startsWith("https://")) {
    getId("tbImg").innerHTML = "(*) Đường dẫn ảnh phải bắt đầu bằng http:// hoặc https://";
    getId("tbImg").classList.remove("hidden");
    isValid = false;
  }

  isValid &= validation.checkEmpty(desc, "tbDesc", "(*) Mô tả không được bỏ trống");
  
  if (brand === "" || brand === null) {
    getId("tbBrand").innerHTML = "(*) Bạn chưa chọn hãng sản xuất";
    getId("tbBrand").classList.remove("hidden");
    isValid = false;
  } else {
    getId("tbBrand").innerHTML = "";
    getId("tbBrand").classList.add("hidden");
  }

  if (!isValid) return null;

  return new Phone(currentEditId, name, Number(price), screen, backCamera, frontCamera, img, desc, brand);
}

getId("phoneForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const phoneData = getInfoPhone();
  if (!phoneData) return; 

  if (currentEditId) {
    try {
      await api.updatePhone(currentEditId, phoneData);
      alert("Cập nhật thông tin điện thoại thành công!");
      closeModal();
      getPhoneList();
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
    }
  } else {
    try {
      await api.addPhone(phoneData);
      alert("Thêm điện thoại mới thành công!");
      closeModal();
      getPhoneList();
    } catch (err) {
      console.error("Lỗi thêm mới sản phẩm:", err);
    }
  }
});

getId("tablePhone").addEventListener("click", function (e) {
  const editBtn = e.target.closest(".btn-edit");
  const deleteBtn = e.target.closest(".btn-delete");

  if (deleteBtn) {
    const id = deleteBtn.getAttribute("data-id");
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      api.deletePhone(id)
        .then(() => {
          alert("Xóa thành công!");
          getPhoneList();
        })
        .catch((err) => console.error("Lỗi xóa sản phẩm:", err));
    }
  }

  if (editBtn) {
    const id = editBtn.getAttribute("data-id");
    currentEditId = id;
    clearErrorMessages();

    api.getPhoneById(id)
      .then((res) => {
        const phone = res.data;
        getId("name").value = phone.name;
        getId("price").value = phone.price;
        getId("screen").value = phone.screen;
        getId("backCamera").value = phone.backCamera;
        getId("frontCamera").value = phone.frontCamera;
        getId("img").value = phone.img;
        getId("desc").value = phone.desc;
        getId("brand").value = phone.type || "";
        
        getId("phoneForm").querySelector("button[type='submit']").innerText = "Update Phone";

        const modal = getId("addPhoneModal");
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      })
      .catch((err) => console.error("Lỗi lấy chi tiết sản phẩm:", err));
  }
});

const btnAddPhoneMain = document.querySelector("[data-modal-target='addPhoneModal']");
if (btnAddPhoneMain) {
  btnAddPhoneMain.addEventListener("click", () => {
    currentEditId = null;
    getId("phoneForm").reset();
    clearErrorMessages();
    getId("phoneForm").querySelector("button[type='submit']").innerText = "Add Phone";
    
    const modal = getId("addPhoneModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });
}

document.querySelectorAll("[data-modal-hide='addPhoneModal']").forEach(btn => {
  btn.addEventListener("click", closeModal);
});

function closeModal() {
  const modal = getId("addPhoneModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  getId("phoneForm").reset();
  clearErrorMessages();
  currentEditId = null;
}

function clearErrorMessages() {
  const errorIds = ["tbName", "tbPrice", "tbScreen", "tbBCam", "tbFCam", "tbImg", "tbDesc", "tbBrand"];
  errorIds.forEach(id => {
    const el = getId(id);
    if (el) {
      el.innerHTML = "";
      el.classList.add("hidden");
    }
  });
}

// --- 6. TÌM KIẾM THEO TÊN ---
getId("searchPhone").addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase().trim();
  const filteredList = phoneListLocal.filter(p => p.name.toLowerCase().includes(keyword));
  renderListPhone(filteredList);
});


getId("sortPrice").addEventListener("change", function (e) {
  const typeSort = e.target.value;
  let sortedList = [...phoneListLocal];
  if (typeSort === "asc") sortedList.sort((a, b) => Number(a.price) - Number(b.price));
  else if (typeSort === "desc") sortedList.sort((a, b) => Number(b.price) - Number(a.price));
  renderListPhone(sortedList);
});

getPhoneList();