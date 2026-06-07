import ApiServices from "../services/ApiServices.js";
import ProductView from "../views/ProductView.js";
import CartItem from "../models/CartItem.js";

// Helper
const getId = (id) => document.getElementById(id);

const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getLocalStorage = (key, original) => {
    const saveData = localStorage.getItem(key);
    if (saveData) return original = JSON.parse(saveData);
}

export default class AppControllers {
    constructor() {
        this.apiService = new ApiServices();
        this.productContainer = getId('product-container');
        this.filterByBrand = getId('filter-by-brand');

        this.productData = [];
        this.cart = [];
    }

    init = async () => {
        const productData = await this.fetchProductData();
        console.log('Danh sach san pham: ', productData);

        this.productData = productData;

        const productView = new ProductView(this.productContainer, this.filterByBrand, this.productData);
        productView.init();

        this.bindEvents();
    }

    bindEvents = () => {

    }

    fetchProductData = () => {
        return this.apiService.getProducts()
            .then(res => res.data)
            .catch(err => {
                console.log(err);
                return null;
            })
    }
}