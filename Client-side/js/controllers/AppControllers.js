import ApiServices from "../services/ApiServices.js";
import ProductView from "../views/ProductView.js";
import CartItem from "../models/CartItem.js";
import CartView from "../views/CartView.js";

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
        this.mainContainer = getId('main-container');
        this.productPage = getId('product-page');
        this.cartPage = getId('cart-page');
        this.productContainer = getId('product-container');
        this.filterByBrand = getId('filter-by-brand');
        this.openCart = getId('btn-open-card');

        this.productView = null;
        this.cartView = null;

        this.productData = [];
        this.cart = [];
    }

    init = async () => {
        const productData = await this.fetchProductData();
        console.log('Danh sach san pham: ', productData);

        this.productData = productData;

        this.productView = new ProductView(this.productContainer, this.filterByBrand, this.productData);
        this.productView.init();

        this.cartView = new CartView(this.productPage, this.cartPage, this.cart);
        this.cartView.init();

        this.bindEvents();
    }

    bindEvents = () => {
        this.productPage.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-to-cart');
            if (!btn) return

            const productId = btn.getAttribute('data-id');
            // console.log(productId);


            const existing = this.cart.findIndex(p => p.product.id === productId);
            console.log('vi tri: ', existing);

            if (existing === -1) {
                const product = this.productData.find(p => p.id === productId);
                // console.log(product);

                const cart = new CartItem(product, 1);
                this.cart.push(cart)
            } else {
                this.cart[existing].quantity += 1;
            }

            console.log(this.cart);
        })

        this.openCart.addEventListener('click', () => {
            this.productPage.classList.add('hidden');
            this.cartPage.classList.remove('hidden');

            this.cartView.render();
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