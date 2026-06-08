import CartItem from "../models/CartItem.js"
import CartView from "../views/CartView.js";

export default class CartController {
    constructor() {
        this.cartView = new CartView('product-page', 'cart-page', 'cart-list', 'total-quantity', 'order-detail');
        this.cartData = [];
    }

    init = () => {
        this.cartView.bindEvents(
            this.handleCloseCart,
            this.handleRemoveItem,
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
        this.updateView();
    }

    handleCloseCart = () => {
        this.cartView.toggleVisibility(false);
    }

    handleRemoveItem = (productId) => {
        const idx = this.cartData.findIndex(p => p.product.id = productId);
        if (idx !== -1) this.cartData.splice(idx, 1);
        this.updateView()
    }

    handleUpdQuantity = (productId, action) => {
        const idx = this.cartData.findIndex(p => p.product.id === productId);
        if (idx !== -1) {
            if (action === 'increase') this.cartData[idx].quantity += 1;
            if (action === 'decrease') {
                if (this.cartData[idx].quantity > 1) this.cartData[idx].quantity -= 1;
                else this.cartData.splice(idx, 1);
            }
            this.updateView();
        }
    }

    handleOpenCart = () => {
        this.cartView.toggleVisibility(true);
    }

    updateView = () => {
        this.cartView.renderList(this.cartData);
        this.cartView.renderBadge(this.getTotalQuantity());
        this.cartView.renderOrderDetail(this.getTotalPrice());
    }

    getTotalQuantity = () => this.cartData.reduce((total, p) => total + p.quantity, 0);

    getTotalPrice = () => this.cartData.reduce((total, p) => total + (p.product.price * p.quantity), 0);
}