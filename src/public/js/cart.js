//OBTENER USUARIO POR EMAIL
async function getUserIdFromEmail(email) {
    try {
        const response = await fetch(`http://localhost:8080/api/users/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const userData = await response.json(); 
            return userData._id;
        } else {
            console.error('Error al obtener el ID de usuario del backend', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener el ID de usuario', error);
        return null;
    }
}

//OBTENER ID DEL CARRITO
async function getCartId(userId, token) {
    try {
        const response = await fetch(`http://localhost:8080/api/carts/${userId}/cartId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            const responseData = await response.json();
            const cartId = responseData.cartId;
            return cartId;
        } else {
            console.error('Error al obtener el ID del carrito del backend', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener el ID de usuario', error);
        return null;
    }
}

//OBTENER EMAIL DE LA COOKIE
function getEmailFromCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const emailCookie = cookies.find(cookie => cookie.startsWith('email'));
    if (emailCookie) {
        return decodeURIComponent(emailCookie.split('=')[1]);
    } else {
        console.error('No se encontró ninguna cookie que contenga el correo electrónico.');
        return null;
    }
}

//OBTENER TOKEN DE LA JWTCOOKIE
function getTokenFromCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('jwtCookieToken'));
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    } else {
        console.error('No se encontró ninguna cookie que contenga el token JWT.');
        return null;
    }
}

//LISTENER
document.addEventListener('DOMContentLoaded', async () => {
    const token = getTokenFromCookie();
    const userEmail = getEmailFromCookie();
    const userId = await getUserIdFromEmail(userEmail);
    const decreaseBtns = document.querySelectorAll('.decreaseBtn');
    const increaseBtns = document.querySelectorAll('.increaseBtn');

    decreaseBtns.forEach(decreaseBtn => {
        decreaseBtn.addEventListener('click', () => {
            let quantityInput = decreaseBtn.nextElementSibling;
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });
    });

    increaseBtns.forEach(increaseBtn => {
        increaseBtn.addEventListener('click', () => {
            let quantityInput = increaseBtn.previousElementSibling;
            let quantity = parseInt(quantityInput.value);
            if (quantity < 10) {
                quantity++;
                quantityInput.value = quantity;
            }
        });
    });

// AGREGAR PRODUCTO AL CARRITO
const buyButtons = document.querySelectorAll('.buy-button');

buyButtons.forEach(button => {
    button.addEventListener('click', async () => {
        if (!token) {
            Toastify({
                text: `Debes Iniciar Sesion🔐`,
                duration: 1500,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#3498db",
                },
            }).showToast();
            return;
        }

        const productId = button.dataset["_id"];
        const productID = button.dataset["id"];
        const productTitle = button.dataset["title"];
        const productPrice = button.dataset["price"];
        const productImage = button.dataset["image"];
        const productQuantityInput = button.parentElement.querySelector('.quantityInput');
        const productQuantity = parseInt(productQuantityInput.value);

        const productData = {
            productId: productId,
            productName: productTitle,
            productPrice: productPrice,
            quantity: productQuantity,
            productImage: productImage
        };

        // Verifica si el producto requiere selección de sabores
        if (productId === 'H14' || productId === 'H12' || productId === 'H1') {
            // Mostrar el modal de selección de sabores
            $('#flavorSelectionModal').modal('show');

            // Aquí puedes agregar la lógica para manejar la selección de sabores y luego proceder con el fetch

        } else {
            // Si no requiere selección de sabores, proceder directamente con el fetch
            try {
                const response = await fetch(`http://localhost:8080/api/carts/${userId}/addItem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    Toastify({
                        text: `Producto agregado: ${productTitle} ✅`,
                        duration: 1500,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            background: "darkcyan",
                        },
                    }).showToast();
                    window.location.reload();
                } else {
                    console.error('Error al agregar el producto al carrito:', response.statusText);
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
            }
        }
    });
});

    // AGREGAR ENVÍO
    const shippingSelect = document.getElementById('shippingSelect');
    if (shippingSelect) {
        shippingSelect.addEventListener('change', () => {
            const totalPriceElement = document.getElementById('totalPrice');
            let totalPrice = parseFloat(totalPriceElement.innerText.replace('$', '').replace(',', ''));
            const previousShippingCost = parseFloat(shippingSelect.dataset.previousShippingCost || '0');
            const shippingCost = parseFloat(shippingSelect.value);
            
            totalPrice = totalPrice - previousShippingCost + shippingCost;
            totalPriceElement.innerText = "$ " + totalPrice.toFixed(2);
            shippingSelect.dataset.previousShippingCost = shippingCost;
        });
    }
});


//ELIMINAR PRODUCTO
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-item');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const userEmail = getEmailFromCookie();
            const userId = await getUserIdFromEmail(userEmail);
            const productId = button.dataset.productid;

            try {
                const response = await fetch(`http://localhost:8080/api/carts/${userId}/deleteItem/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto del carrito.');
                }

                Toastify({
                    text: `Producto Eliminado❌`,
                    duration: 1500,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "rgba(236, 3, 3, 0.945)",
                    }
                }).showToast();
                window.location.reload();
            } catch (error) {
                console.error('Error del servidor al eliminar el producto del carrito:', error);
            }
        });
    });
});

// COMPRAR
document.addEventListener('DOMContentLoaded', async () => {
    const buyButton = document.querySelector('#purchase');
    buyButton.addEventListener('click', async () => {
        try { 
            Swal.fire({
                title: 'Estamos Procesando su Compra!',
                icon: 'info',
                text: 'Por favor espere un momento!🕐',
                timer: 2500
            }).then(() => {
                document.getElementById('checkout-form').submit();
            });
        } catch (error) {
            console.error('Error al realizar la compra:', error);
        }
    });
});

// Manejar selección de sabores
document.addEventListener('DOMContentLoaded', () => {
    const selectFlavorBtns = document.querySelectorAll('.select-flavors-btn');
    let selectedFlavors = [];

    selectFlavorBtns.forEach(button => {
        button.addEventListener('click', () => {
            selectedFlavors = []; // Reset selected flavors on new product selection
            const maxFlavors = parseInt(button.dataset.maxFlavors);
            const flavorModal = document.getElementById('flavorModal');

            flavorModal.querySelectorAll('.flavor-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        if (selectedFlavors.length < maxFlavors) {
                            selectedFlavors.push(event.target.value);
                        } else {
                            event.target.checked = false;
                            alert(`Solo puedes seleccionar hasta ${maxFlavors} sabores.`);
                        }
                    } else {
                        const index = selectedFlavors.indexOf(event.target.value);
                        if (index > -1) {
                            selectedFlavors.splice(index, 1);
                        }
                    }
                });
            });

            const confirmBtn = flavorModal.querySelector('.confirm-flavors-btn');
            confirmBtn.addEventListener('click', () => {
                // Aquí puedes agregar la lógica para actualizar la vista del producto con los sabores seleccionados
                alert(`Sabores seleccionados: ${selectedFlavors.join(', ')}`);
                $('#flavorModal').modal('hide'); // Cierra el modal
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar la apertura del modal para cargar sabores
    const selectFlavorButtons = document.querySelectorAll('.select-flavors-btn');
    let selectedProductData = {};  // Variable para almacenar los datos del producto seleccionado

    selectFlavorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productTitle = button.dataset["title"];
            const productPrice = button.dataset["price"];
            const maxFlavors = parseInt(button.dataset["max-flavors"]);

            selectedProductData = {
                title: productTitle,
                price: productPrice,
                //maxFlavors: maxFlavors,
                productId: button.dataset["_id"],
                image: button.dataset["image"]
            };

            // Limpiar los sabores seleccionados previos
            document.querySelector('#flavorForm .flavors-list').innerHTML = '';

            // Cargar sabores dinámicamente (esto es solo un ejemplo)
            const flavors = ['Vainilla', 'Chocolate', 'Fresa', 'Menta', 'Dulce de leche'];  // Sabores de ejemplo
            flavors.forEach(flavor => {
                const flavorCheckbox = `
                    <div class="form-check">
                        <input class="form-check-input flavor-checkbox" type="checkbox" value="${flavor}" id="flavor-${flavor}">
                        <label class="form-check-label" for="flavor-${flavor}">${flavor}</label>
                    </div>
                `;
                document.querySelector('#flavorForm .flavors-list').insertAdjacentHTML('beforeend', flavorCheckbox);
            });

            // Limitar la cantidad de sabores seleccionables
            const flavorCheckboxes = document.querySelectorAll('.flavor-checkbox');
            flavorCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selectedFlavors = document.querySelectorAll('.flavor-checkbox:checked');
                    if (selectedFlavors.length > maxFlavors) {
                        checkbox.checked = false;
                    }
                });
            });
        });
    });

    // Manejar el clic en "Agregar al Carrito"
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', async () => {
        const selectedFlavors = Array.from(document.querySelectorAll('.flavor-checkbox:checked')).map(cb => cb.value);
        if (selectedFlavors.length > selectedProductData.maxFlavors) {
            alert(`Por favor selecciona solo ${selectedProductData.maxFlavors} sabores.`);
            return;
        }

        const productData = {
            productId: selectedProductData.productId,
            productName: selectedProductData.title,
            productPrice: selectedProductData.price,
            quantity: 1,  // Se puede agregar la lógica para manejar la cantidad
            productImage: selectedProductData.image,
            //flavors: selectedFlavors
        };

        const token = getTokenFromCookie();
        const userEmail = getEmailFromCookie();
        const userId = await getUserIdFromEmail(userEmail);

        try {
            const response = await fetch(`http://localhost:8080/api/carts/${userId}/addItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                Toastify({
                    text: `Producto agregado: ${selectedProductData.title} ✅`,
                    duration: 1500,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "darkcyan",
                    },
                }).showToast();
                document.getElementById('flavorModal').click();  // Cerrar el modal
                window.location.reload();
            } else {
                console.error('Error al agregar el producto al carrito:', response.statusText);
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
    });
});


