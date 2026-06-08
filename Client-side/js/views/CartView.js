// Helper
const getId = (id) => document.getElementById(id);

export default class CartView {
    constructor(productPageId, cartPageId, cartListId, totalQuantityId, orderDetailId) {
        this.productPage = getId(productPageId);
        this.cartPage = getId(cartPageId);
        this.cartList = getId(cartListId);
        this.totalQuantity = getId(totalQuantityId);
        this.orderDetail = getId(orderDetailId);
    }

    bindEvents = (onCloseCart, onRemove, onUpdQuantity) => {
        getId('btn-continue-shopping').addEventListener('click', () => {
            if (onCloseCart) onCloseCart();
        })

        this.cartList.addEventListener('click', (e) => {
            // tang/giam so luong
            const btnQty = e.target.closest('.btn-quantity');
            if (btnQty) {
                const action = btnQty.getAttribute('data-action');
                const productId = btnQty.getAttribute('data-id');

                if (onUpdQuantity) onUpdQuantity(productId, action);
            }

            // xoa sp
            const btnRemove = e.target.closest('.btn-remove');
            if (btnRemove) {
                const productId = btnRemove.getAttribute('data-id');

                if (onRemove) onRemove(productId);
            }
        })
    }

    toggleVisibility = (isShowCart) => {
        if (isShowCart) {
            this.productPage.classList.add('hidden');
            this.cartPage.classList.remove('hidden');
        } else {
            this.productPage.classList.remove('hidden');
            this.cartPage.classList.add('hidden');
        }
    }

    renderBadge = (totalQuantity) => {
        if (totalQuantity === 0) {
            this.totalQuantity.innerHTML = 0;
            this.totalQuantity.classList.add('hidden');
        } else {
            this.totalQuantity.innerHTML = totalQuantity;
            this.totalQuantity.classList.remove('hidden');
        }
    }

    renderList = (cartData) => {
        let html = '';
        if (cartData.length === 0) {
            html = `
                <div class="h-30 p-4 flex flex-col justify-center items-center">
                    <span class="text-xs text-slate-400 font-medium uppercase">Không có sản phẩm</span>
                </div>
            `
        } else {
            html = cartData.map(p => `
                <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative group">
                    <div class="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-400 text-xs font-semibold">
                        <img src="${p.product.img}" alt="${p.product.name}">
                    </div>
                    
                    <div class="flex-grow text-center sm:text-left w-full sm:w-auto">
                        <span class="text-xs text-slate-400 font-medium uppercase">${p.product.type}</span>
                        <h3 class="font-bold text-slate-900 text-lg mt-0.5">${p.product.name}</h3>
                        <p class="text-slate-400 text-sm mt-0.5"></p>
                        <p class="text-amber-600 font-extrabold text-base mt-2 sm:hidden">${p.product.price.toLocaleString('vi-VN')}đ</p>
                    </div>

                    <div class="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                        <button data-id="${p.product.id}" data-action="decrease" class="btn-quantity w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-full transition-colors font-bold">-</button>
                        <span class="w-10 text-center font-semibold text-sm text-slate-900">${p.quantity}</span>
                        <button data-id="${p.product.id}" data-action="increase" class="btn-quantity w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded-full transition-colors font-bold">+</button>
                    </div>

                    <div class="hidden sm:block text-right min-w-[120px]">
                        <p class="text-slate-900 font-extrabold text-lg">${(p.product.price * p.quantity).toLocaleString('vi-VN')}đ</p>
                        <p class="text-xs text-slate-400 line-through"></p>
                    </div>

                    <button data-id="${p.product.id}" class="btn-remove absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>    
            `).join("");
        }

        this.cartList.innerHTML = html;
    }

    renderOrderDetail = (totalPrice) => {
        this.orderDetail.innerHTML = `
            <div class="space-y-4 text-sm mb-6">
                <div class="flex justify-between text-slate-500">
                    <span>Tạm tính</span>
                    <span class="font-semibold text-slate-900">${totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div class="flex justify-between text-slate-500">
                    <span>Phí vận chuyển</span>
                    <span class="font-semibold text-green-600">Miễn phí</span>
                </div>
                <hr class="border-slate-100">
                <div class="flex justify-between text-base">
                    <span class="font-bold text-slate-900">Tổng cộng</span>
                    <span class="font-black text-xl text-amber-600">${totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <p class="text-[11px] text-slate-400 text-right">(Đã bao gồm thuế VAT)</p>
            </div>
        `
    }
}