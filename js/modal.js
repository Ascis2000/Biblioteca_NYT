

const appModal = {
    txtModal: getById('txtModal'),
    closeModal: getById('closeModal'),
    fondoModal: getById('fondoModal')
}

// Función para mostrar el modal
function mostrarModal(texto) {
    appModal.txtModal.textContent = texto;
    appModal.fondoModal.classList.remove('hidden');
};

// Función para ocultar el modal
appModal.closeModal.addEventListener('click', () => {
    appModal.fondoModal.classList.add('hidden');
});
