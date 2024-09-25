document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.querySelector('#addUserBtn');
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));

    addUserButton.addEventListener('click', function () {
        modal.show();
    });

    const form = document.querySelector('#registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const obj = {};
        formData.forEach((value, key) => obj[key] = value);
        try {
            const response = await fetch('/api/jwt/register', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                Swal.fire({
                    title: 'Usuario creado con éxito✅',
                    icon: 'success',
                    text: '',
                    timer: 2500
                });
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error.message);
            Toastify({
                text: `Se produjo un error al crear el usuario⛔`,
                duration: 1500,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "rgba(236, 3, 3, 0.945)",
                }
            }).showToast();
        }
    });

    const eliminarUsuariosBtn = document.getElementById('eliminarUsuariosBtn');
    eliminarUsuariosBtn.addEventListener('click', async function () {
        try {
            const response = await fetch('/api/users', {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Usuarios inactivos eliminados correctamente.',
                    icon: 'success',
                    text: '48hs inactivos',
                    timer: 2500
                });
                window.location.reload();
            } else {
                throw new Error('Error al eliminar usuarios inactivos.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            Toastify({
                text: `Se produjo un error al eliminar usuarios inactivos.⛔`,
                duration: 1500,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "rgba(236, 3, 3, 0.945)",
                }
            }).showToast();
        }
    });

    // Lógica para editar usuarios
    document.querySelectorAll('[id^="editUserBtn_"]').forEach(button => {
        button.addEventListener('click', async function () {
            const userId = this.id.split('_')[1];
            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }

                const user = await response.json();

                document.getElementById('edit_first_name').value = user.first_name;
                document.getElementById('edit_last_name').value = user.last_name;
                document.getElementById('edit_email').value = user.email;
                document.getElementById('edit_age').value = user.age;

                const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
                modal.show();

                const editUserForm = document.getElementById('editUserForm');
                editUserForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(editUserForm);
                    const updatedUser = Object.fromEntries(formData.entries());

                    try {
                        const updateResponse = await fetch(`/api/users/UpDateUser/${userId}`, {
                            method: 'PUT',
                            body: JSON.stringify(updatedUser),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (updateResponse.ok) {
                            Swal.fire({
                                title: 'Usuario actualizado con éxito✅',
                                icon: 'success',
                                timer: 2500
                            });
                            window.location.reload();
                        } else {
                            throw new Error('Error al actualizar el usuario');
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                        Toastify({
                            text: `Se produjo un error al actualizar el usuario⛔`,
                            duration: 1500,
                            gravity: "top",
                            position: "center",
                            style: {
                                background: "rgba(236, 3, 3, 0.945)",
                            }
                        }).showToast();
                    }
                };
            } catch (error) {
                console.error('Error:', error.message);
                Toastify({
                    text: `Se produjo un error al obtener los datos del usuario⛔`,
                    duration: 1500,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
            }
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-user-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const userId = button.getAttribute('data-user-id');

            try {
                const response = await fetch(`/api/users/${userId}/deleteUser`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Usuario eliminado correctamente.',
                        icon: 'success',
                        text: '',
                        timer: 2500
                    });
                    window.location.reload();
                } else {
                    throw new Error('Error al eliminar usuario');
                }
            } catch (error) {
                Toastify({
                    text: `Se produjo un error al eliminar el usuario.⛔`,
                    duration: 1500,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Lógica para eliminar productos
    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.getAttribute('data-product-id');
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (response.ok) {
                    Swal.fire({
                        title: 'Producto eliminado correctamente.',
                        icon: 'success',
                        timer: 2500
                    });
                    window.location.reload();
                } else {
                    throw new Error(result.message || 'Error al eliminar el producto.');
                }
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                Toastify({
                    text: `Se produjo un error al eliminar el producto⛔`,
                    duration: 1500,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
            }
        });
    });

    // Lógica para agregar productos
    addProductForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(addProductForm);
        const productData = Object.fromEntries(formData.entries());
        console.log('Datos del producto:', productData);  
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Producto agregado correctamente',
                    icon: 'success',
                    timer: 2500
                });
                window.location.reload();
            } else {
                throw new Error(result.message || 'Error al agregar el producto.');
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            Toastify({
                text: `Se produjo un error al agregar el producto⛔`,
                duration: 1500,
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "rgba(236, 3, 3, 0.945)",
                }
            }).showToast();
        }
    });
    

    // Lógica para editar productos
    document.querySelectorAll('[id^=editProductBtn_]').forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.id.split('_')[1];
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del producto');
                }

                const product = await response.json();
                document.getElementById('edit_product_name').value = product.title;
                document.getElementById('edit_description').value = product.description;
                document.getElementById('edit_stock').value = product.stock;
                document.getElementById('edit_price').value = product.price;

                const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
                modal.show();

                const editProductForm = document.getElementById('editProductForm');
                editProductForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(editProductForm);
                    const updatedProduct = Object.fromEntries(formData.entries());

                    try {
                        const updateResponse = await fetch(`/api/products/${productId}`, {
                            method: 'PUT',
                            body: JSON.stringify(updatedProduct),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (updateResponse.ok) {
                            Swal.fire({
                                title: 'Producto actualizado con éxito✅',
                                icon: 'success',
                                timer: 2500
                            });
                            window.location.reload();
                        } else {
                            throw new Error('Error al actualizar el producto');
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                        Toastify({
                            text: `Se produjo un error al actualizar el producto⛔`,
                            duration: 1500,
                            gravity: "top",
                            position: "center",
                            style: {
                                background: "rgba(236, 3, 3, 0.945)",
                            }
                        }).showToast();
                    }
                };
            } catch (error) {
                console.error('Error:', error.message);
                Toastify({
                    text: `Se produjo un error al obtener los datos del producto⛔`,
                    duration: 1500,
                    gravity: "top",
                    position: "center",
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
            }
        });
    });
});
