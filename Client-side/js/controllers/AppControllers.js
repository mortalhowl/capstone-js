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
        this.productContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-to-cart');
            if (!btn) return

            const productId = btn.getAttribute('data-id');
            // console.log(productId);
            const product = this.productData.find(p => p.id === productId);
            // console.log(product);

            const existing = this.cart.findIndex(p => p.product.id === productId);
            console.log('vi tri: ', existing);

            if (existing === -1) {
                const cart = new CartItem(product, 1);
                this.cart.push(cart)
            } else {
                this.cart[existing].quantity += 1;
            }

            console.log(this.cart);
        })
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