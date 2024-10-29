

const appModal = {
    txtModal: getById('txtModal'),
    boxModal: getById('boxModal'),
    closeModal: getById('btn_closeModal')
}

// Función para mostrar el modal
function mostrarModal(texto) {
    appModal.txtModal.textContent = texto;
    appModal.boxModal.classList.remove('hidden');
};

// Función para ocultar el modal
appModal.closeModal.addEventListener('click', () => {
    appModal.boxModal.classList.add('hidden');
});
