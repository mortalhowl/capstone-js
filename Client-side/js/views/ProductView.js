// Helper
const getId = (id) => document.getElementById(id);

export default class ProductView {
    constructor(productContainer, filterByBrand, productData) {
        this.productContainer = productContainer;
        this.filterByBrand = filterByBrand;
        this.productData = productData;

        this.allTypes = [...new Set(this.productData.map(p => p.type))];
    }

    init = () => {
        this.renderProductList(this.productData);
        this.renderFilterByBrand();

        this.bindEvents();
    }

    update = (filteredData) => {
        this.renderProductList(filteredData);
    }

    bindEvents = () => {
        this.filterByBrand.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-filter-by-brand');
            if (!btn) return

            const type = btn.getAttribute('data-type');
            // console.log(type);

            const allBtns = this.filterByBrand.querySelectorAll('.btn-filter-by-brand');
            // console.log(allBtns);

            allBtns.forEach(btn => {
                btn.classList.remove('bg-slate-900', 'text-white');
                btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
            })
            btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
            btn.classList.add('bg-slate-900', 'text-white');

            let filteredData = [];
            if (type === 'all') {
                filteredData = this.productData;
            } else {
                filteredData = this.productData.filter(p => p.type === type);
            }
            // console.log('Filter data: ', filteredData);

            this.update(filteredData);
        })
    }

    renderProductList = (productData) => {
        this.productContainer.innerHTML = productData.map(p => `
            <div
                class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between transition-all animate__animated animate__fadeIn">
                <div class="p-4 flex flex-col items-center">                    
                    <div
                        class="w-full h-40 bg-white rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-slate-400 font-medium">
                        <img src="${p.img}" alt="${p.name}"
                            class="rounded-xl object-contain w-full h-full">
                    </div>
                    <div class="w-full text-left">
                        <span class="text-xs text-slate-400 font-medium uppercase">${p.type}</span>
                        <h4 class="font-bold text-slate-900 mt-1 line-clamp-2 min-h-[48px]">${p.name}</h4>
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

        const html = this.allTypes.map(type => `
            <button data-type="${type}" class="btn-filter-by-brand px-5 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium transition-colors shadow-xs cursor-pointer">${type}</button>
        `).join("");

        this.filterByBrand.insertAdjacentHTML('beforeend', html);
    }
}