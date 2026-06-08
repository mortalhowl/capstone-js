import ProductController from "./ProductController.js";
import CartController from "./CartController.js";

const getId = (id) => document.getElementById(id);

export default class AppControler {
    constructor() {
        this.cartController = new CartController();
        this.productController = new ProductController(this.cartController.addToCart);
    }

    init = async () => {
        await this.productController.init();
        this.cartController.init();

        getId('btn-open-card').addEventListener('click', () => this.cartController.handleOpenCart())
    }
}