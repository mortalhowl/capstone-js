import ApiServices from "../services/ApiServices.js";
import ProductView from "../views/ProductView.js";

export default class ProductController {
    constructor(onAddToCardCallBack) {
        this.onAddToCard = onAddToCardCallBack
        this.apiService = new ApiServices();
        this.productView = new ProductView('product-container', 'filter-by-brand', 'btn-asc', 'btn-desc');

        this.productData = [];
        this.currentType = 'all';
        this.currentSort = null;
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
            this.handleSortClick,
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

    handleAddToCartClick = (productId) => {
        const product = this.productData.find(p => p.id === productId);
        // console.log('sp: ', product);
        this.onAddToCard(product);
    }

    applyFilter = () => {
        let filteredData = this.currentType === 'all'
            ? this.productData
            : this.productData.filter(p => p.type === this.currentType);

        if (this.currentSort === 'asc') filteredData.sort((a, b) => a.price - b.price);
        else if (this.currentSort === 'desc') filteredData.sort((a, b) => b.price - a.price);

        this.productView.renderProductList(filteredData);
    }

    handleFilterClick = (type) => {
        this.currentType = type;
        this.applyFilter();
    }

    handleSortClick = (sort) => {
        this.currentSort = sort;
        this.applyFilter();
    }
}