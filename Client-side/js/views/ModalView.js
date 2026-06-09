const getId = (id) => document.getElementById(id);

export default class ModalView {
    constructor() {
        this.modal = getId('confirm-modal');
        this.modalTitle = getId('modal-title');
        this.modalMessage = getId('modal-message');
        this.btnConfirm = getId('btn-modal-confirm');
        this.btnCancel = getId('btn-modal-cancel');
    }

    show = (title, message) => {
        return new Promise((resolve) => {
            this.modalTitle.innerHTML = title;
            this.modalMessage.innerHTML = message;

            // show
            this.modal.classList.remove('hidden');

            // vừa dùng promise + addEventListener => xóa lắng nghe sự kiện khi promise die
            const cleanup = () => {
                this.btnConfirm.removeEventListener('click', handleConfirm);
                this.btnCancel.removeEventListener('click', handleCancel);

                this.close();
            }

            const handleConfirm = () => {
                // console.log('click confirm');

                cleanup();
                resolve(true);
            }

            const handleCancel = () => {
                // console.log('click cancel');

                cleanup();
                resolve(false);
            }

            this.btnConfirm.addEventListener('click', handleConfirm);
            this.btnCancel.addEventListener('click', handleCancel);
        })
    }

    close = () => {
        this.modal.classList.add('hidden');
    }
}