import CartItem from "../models/CartItem.js"
import CartView from "../views/CartView.js";

export default class CartController {
    constructor() {
        this.cartView = new CartView('product-page', 'cart-page', 'cart-list');
        this.cartData = [];
    }

    init = () => {
        this.cartView.bindEvents(
            this.handleCloseCart,
            this.handleRemove,
            this.handleUpdQuantity,
        );
        this.updateView();
    }

    addToCart = (product) => {
        const existing = this.cartData.findIndex(p => p.product.id === product.id);

        if (existing === -1) {
            const cartItem = new CartItem(product, 1);
            this.cartData.push(cartItem);
        } else this.cartData[existing].quantity += 1;
        this.updateView()
    }

    handleCloseCart = () => {
        this.cartView.toggleVisibility(false);
    }

    handleRemove = () => {

    }

    handleUpdQuantity = () => {

    }

    handleOpenCart = () => {
        this.cartView.toggleVisibility(true);
    }

    updateView = () => {
        this.cartView.render(this.cartData);
    }
}