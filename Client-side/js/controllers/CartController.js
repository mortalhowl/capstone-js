import CartItem from "../models/CartItem.js"
import CartView from "../views/CartView.js";
import toastService from "../services/ToastService.js";
import ModalView from "../views/modalView.js";

const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getLocalStorage = (key) => {
    const saveData = localStorage.getItem(key);
    return saveData ? JSON.parse(saveData) : [];
}

export default class CartController {
    constructor() {
        this.cartView = new CartView('product-page', 'cart-page', 'cart-list', 'total-quantity', 'order-detail', 'btn-checkout');
        this.cartData = getLocalStorage('CART_DATA') || [];

        this.confitmModal = new ModalView();
    }

    init = () => {
        this.cartView.bindEvents(
            this.handleCloseCart,
            this.handleRemoveItem,
            this.handleUpdQuantity,
            this.handleCheckout,
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
        this.saveData();
        toastService.success('Thêm sản phẩm thành công');
    }

    handleCloseCart = () => {
        this.cartView.toggleVisibility(false);
    }

    handleRemoveItem = (productId) => {
        const idx = this.cartData.findIndex(p => p.product.id = productId);
        if (idx !== -1) this.cartData.splice(idx, 1);
        this.updateView();
        this.saveData();
        toastService.success('Xóa sản phẩm thành công');
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
            this.saveData();
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

    saveData = () => {
        setLocalStorage('CART_DATA', this.cartData);
    }

    getTotalQuantity = () => this.cartData.reduce((total, p) => total + p.quantity, 0);

    getTotalPrice = () => this.cartData.reduce((total, p) => total + (p.product.price * p.quantity), 0);

    removeAllCart = () => this.cartData.splice(0, this.cartData.length);

    handleCheckout = async () => {
        const isConfirm = await this.confitmModal.show(
            'Xác nhận',
            `Bạn có muốn thanh toán ${this.getTotalPrice().toLocaleString('vi-VN')}đ không?`
        )
        if (isConfirm) {
            this.removeAllCart();
            this.updateView();
            this.saveData();
            toastService.success('Thanh toán thành công');
        }
    }
}