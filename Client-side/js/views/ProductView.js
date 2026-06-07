// Helper
const getId = (id) => document.getElementById(id);

export default class ProductView {
    constructor(productContainer, filterByBrand, productData) {
        this.productContainer = productContainer;
        this.filterByBrand = filterByBrand;
        this.productData = productData;
    }

    init = () => {
        this.renderProductList();
        this.renderFilterByBrand();
    }

    renderProductList = () => {
        this.productContainer.innerHTML = this.productData.map(p => `
            <div
                class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div class="p-4 flex flex-col items-center">                    
                    <div
                        class="w-full h-auto bg-white rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-slate-400 font-medium">
                        <img src="${p.img}" alt="${p.name}"
                            class="rounded-xl">
                    </div>
                    <div class="w-full text-left">
                        <span class="text-xs text-slate-400 font-medium uppercase">${p.type}</span>
                        <h4 class="font-bold text-slate-900 text-base mt-1 truncate">${p.name}</h4>
                    </div>
                </div>
                <div class="px-4 pb-4 border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
                    <div>
                        <p class="text-amber-600 font-extrabold text-base">${p.price.toLocaleString('vi-VN')}đ</p>
                        <p class="text-xs text-slate-400 line-through"></p>
                    </div>
                    <button
                        data-id="${p.id}"
                        class="btn-add-to-cart p-2.5 bg-amber-550/10 hover:bg-amber-500 text-amber-600 hover:text-white rounded-xl transition-all duration-300 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            </div>    
        `).join("")
    }

    renderFilterByBrand = () => {
        const firstChild = this.filterByBrand.firstElementChild;
        if (firstChild) {
            this.filterByBrand.innerHTML = '';
            this.filterByBrand.appendChild(firstChild);
        }

        const allTypes = [...new Set(this.productData.map(p => p.type))]; // spread operator 
        const html = allTypes.map(type => `
            <button data-type="${type}" class="btn-filter-by-brand px-5 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium transition-colors shadow-xs">${type}</button>
        `).join("");

        this.filterByBrand.insertAdjacentHTML('beforeend', html);
    }
}