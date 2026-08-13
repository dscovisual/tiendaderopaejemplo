// 1. Base de datos simulada
const products = [
    { id: 1, name: "Campera Puffer Negra", price: 45000, category: "camperas", sizes: ["S", "M", "L", "XL"], image: "/home/jplinuxero/Documentos/programacion/html/ejemplos/tienda de ropa/img/dsc06843-1e1235be2a7f13192617489533210887-1024-1024.webp" },
    { id: 2, name: "Remera Oversize Básica", price: 12000, category: "remeras", sizes: ["M", "L", "XL"], image: "/home/jplinuxero/Documentos/programacion/html/ejemplos/tienda de ropa/img/over-8b552b800c39cf57b117471070026275-1024-1024.webp" },
    { id: 3, name: "Pantalón Cargo Vintage", price: 35000, category: "pantalones", sizes: ["40", "42", "44"], image: "/home/jplinuxero/Documentos/programacion/html/ejemplos/tienda de ropa/img/489150-800-auto.webp" },
    { id: 4, name: "Gorra Snapback", price: 8000, category: "accesorios", sizes: ["Único"], image: "/home/jplinuxero/Documentos/programacion/html/ejemplos/tienda de ropa/img/images.jpeg" },
    { id: 5, name: "Campera de Jean", price: 38000, category: "camperas", sizes: ["S", "M", "L"], image: "/home/jplinuxero/Documentos/programacion/html/ejemplos/tienda de ropa/img/CHK67151_SW_2.jpg" }
];

let cart = []; // Estado del carrito

// 2. Elementos del DOM
const grid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// 3. Renderizar Productos
function renderProducts(category = "todos") {
    grid.innerHTML = "";
    
    const filtered = category === "todos" 
        ? products 
        : products.filter(p => p.category === category);

    filtered.forEach(product => {
        // Crear las opciones de talle
        const sizeOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join("");

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h2 class="product-price">$${product.price.toLocaleString('es-AR')}</h2>
            <p class="product-name">${product.name}</p>
            <select class="size-selector" id="size-${product.id}">
                ${sizeOptions}
            </select>
            <button class="add-btn" onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        grid.appendChild(card);
    });
}

// 4. Lógica del Carrito
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const selectedSize = document.getElementById(`size-${productId}`).value;
    
    // Identificador único (id del producto + talle)
    const cartItemId = `${productId}-${selectedSize}`;
    const existingItem = cart.find(item => item.cartId === cartItemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartId: cartItemId,
            name: product.name,
            price: product.price,
            size: selectedSize,
            quantity: 1
        });
    }
    updateCartUI();
};

window.updateQuantity = (cartId, change) => {
    const item = cart.find(i => i.cartId === cartId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.cartId !== cartId); // Eliminar si llega a 0
    }
    updateCartUI();
};

function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div>
                <p><strong>${item.name}</strong> (Talle: ${item.size})</p>
                <p>$${item.price.toLocaleString('es-AR')} c/u</p>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity('${item.cartId}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.cartId}', 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });

    cartTotalEl.innerText = total.toLocaleString('es-AR');
    cartCountEl.innerText = count;
}

// 5. Checkout vía WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let text = "¡Hola! Quiero hacer el siguiente pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        text += `- ${item.quantity}x ${item.name} (Talle: ${item.size}) - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        total += (item.price * item.quantity);
    });

    text += `\n*Total a pagar: $${total.toLocaleString('es-AR')}*`;

    // Reemplazá este número por el tuyo (código de país + área + número, sin + ni espacios)
    const phoneNumber = "5493880000000"; 
    const encodedText = encodeURIComponent(text);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
});

// 6. Eventos de la UI
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.dataset.category);
    });
});

cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));

// Inicializar la app
renderProducts();