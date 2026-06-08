import ApiServices from "../services/ApiServices.js";
import ProductView from "../views/ProductView.js";

export default class ProductController {
    constructor(onAddToCardCallBack) {
        this.onAddToCard = onAddToCardCallBack
        this.apiService = new ApiServices();
        this.productView = new ProductView('product-container', 'filter-by-brand');

        this.productData = [];
    }

    init = async () => {
        this.productData = await this.fetchProductData();
        console.log('danh sach sp: ', this.productData);

        const allTypes = [...new Set(this.productData.map(p => p.type))];

        this.productView.renderProductList(this.productData);
        this.productView.renderFilterByBrand(allTypes);

        this.productView.bindEvents(
            this.handleFilterClick,
            this.handleAddToCartClick,
        )
    }

    fetchProductData = () => {
        return this.apiService.getProducts()
            .then(res => res.data)
            .catch(err => {
                console.log(err);
                return null;
            })
    }

    handleFilterClick = (type) => {
        let filteredData = []
        if (type === 'all') filteredData = this.productData;
        else filteredData = this.productData.filter(p => p.type === type);
        this.productView.renderProductList(filteredData);
    }

    handleAddToCartClick = (productId) => {
        const product = this.productData.find(p => p.id === productId);
        // console.log('sp: ', product);
        this.onAddToCard(product);
    }
}