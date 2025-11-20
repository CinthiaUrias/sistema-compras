
/* script.js - datos, render y lógica del carrito (persistencia con localStorage) */

const PRODUCTS = [
  {id:1,name:"Smartphone X1",category:"Smartphones",price:6999,stock:8,images:["https://picsum.photos/seed/p1/800/600"],desc:"Smartphone con cámara de 48MP y pantalla OLED 6.5''."},
  {id:2,name:"Laptop Pro 14",category:"Laptops",price:24999,stock:5,images:["https://picsum.photos/seed/p2/800/600"],desc:"Laptop con procesador moderno, 16GB RAM y SSD de 512GB."},
  {id:3,name:"Audífonos Bluetooth",category:"Accesorios",price:1299,stock:12,images:["https://picsum.photos/seed/p3/800/600"],desc:"Audífonos con cancelación de ruido y 30h de batería."},
  {id:4,name:"Smartphone Y2",category:"Smartphones",price:5999,stock:3,images:["https://picsum.photos/seed/p4/800/600"],desc:"Modelo económico con buen rendimiento diario."},
  {id:5,name:"Mouse Inalámbrico",category:"Accesorios",price:399,stock:20,images:["https://picsum.photos/seed/p5/800/600"],desc:"Mouse ergonómico con sensor de alta precisión."},
  {id:6,name:"Laptop Ultraligera ",category:"Laptops",price:18999,stock:2,images:["https://picsum.photos/seed/p6/800/600"],desc:"Ultraligera, ideal para movilidad y trabajo remoto."}
];
const LS_CART = "sistema_compras_cart_v1";
const LS_ORDERS = "sistema_compras_orders_v1";
const LS_PRODUCTS = "sistema_compras_products_v1"; // used to persist stock across sessions

// Initialize persisted products (inventory) if not present
function initProducts() {
  if (!localStorage.getItem(LS_PRODUCTS)) {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(PRODUCTS));
  }
}
initProducts();

function getProducts() {
  return JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
}

function saveProducts(arr) {
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(arr));
}

function showToast(msg, time=2000){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), time);
}

function getCart(){
  return JSON.parse(localStorage.getItem(LS_CART) || "[]");
}
function saveCart(c){ localStorage.setItem(LS_CART, JSON.stringify(c)); }

function updateCartCount(){
  const c = getCart();
  const el = document.getElementById('cart-count');
  if(el) el.textContent = c.reduce((s,i)=>s+i.q,0);
}

/* ---- Render index products ---- */
function renderProducts(filterCat) {
  const container = document.getElementById('productos');
  if(!container) return;
  const products = getProducts();
  const list = (!filterCat || filterCat==='all') ? products : products.filter(p=>p.category===filterCat);
  container.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="small">${p.category}</p>
      <p>${formatMoney(p.price)}</p>
      <div class="meta">
        <div>
          ${p.stock<=3 ? '<span class="low-stock">¡Stock bajo!</span>' : '<span class="small">Stock: '+p.stock+'</span>'}
        </div>
        <div>
          <button class="btn" onclick="viewDetail(${p.id})">Ver detalle</button>
          <button class="btn primary" onclick="addToCart(${p.id})">Agregar</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ---- Product detail ---- */
function getQueryParam(key){
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}
function renderProductDetail(){
  const id = parseInt(getQueryParam('id'));
  const det = document.getElementById('detalle');
  if(!det) return;
  const products = getProducts();
  const p = products.find(x=>x.id===id);
  if(!p){
    det.innerHTML = '<p>Producto no encontrado. <a href="index.html">Volver</a></p>';
    return;
  }
  det.innerHTML = `
    <div class="row">
      <div>
        <img src="${p.images[0]}" alt="${p.name}">
      </div>
      <div>
        <h2>${p.name}</h2>
        <p class="small">${p.category}</p>
        <p>${formatMoney(p.price)}</p>
        <p>${p.desc}</p>
        <p>${p.stock<=3 ? '<span class="low-stock">¡Quedan '+p.stock+' unidades!</span>' : 'Stock: '+p.stock}</p>
        <div style="margin-top:12px;">
          <label>Cantidad</label>
          <input type="number" id="qty" min="1" max="${p.stock}" value="1" style="width:80px;padding:6px;margin-top:6px">
          <div style="margin-top:10px;">
            <button class="btn primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
            <button class="btn" onclick="location.href='index.html'">Volver</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ---- Cart actions ---- */
function addToCart(id){
  const products = getProducts();
  const p = products.find(x=>x.id===id);
  if(!p || p.stock<=0){ showToast('Producto sin stock'); return; }
  const qtyInput = document.getElementById('qty');
  let qty = 1;
  if(qtyInput) qty = Math.max(1, Math.min(parseInt(qtyInput.value)||1, p.stock));
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing){
    const newQty = Math.min(existing.q + qty, p.stock);
    existing.q = newQty;
  } else {
    cart.push({id:id,q:qty});
  }
  saveCart(cart);
  updateCartCount();
  showToast('Producto agregado');
}

/* ---- Cart page render ---- */
function renderCartPage(){
  const cont = document.getElementById('carrito-contenido');
  if(!cont) return;
  const cart = getCart();
  const products = getProducts();
  if(cart.length===0){
    cont.innerHTML = '<p>Tu carrito está vacío. <a href="index.html">Ir a productos</a></p>';
    return;
  }
  let html = '<div>';
  let total = 0;
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    const subtotal = (p ? p.price * item.q : 0);
    total += subtotal;
    html += `<div class="carrito-item">
      <img src="${p.images[0]}" alt="${p.name}" style="width:80px;height:60px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${p.name}</strong><div class="small">${p.category}</div></div>
          <div>${formatMoney(subtotal)}</div>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <div class="qty">
            <button class="btn" onclick="changeQty(${item.id}, -1)">-</button>
            <span style="padding:6px 10px">${item.q}</span>
            <button class="btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <button class="btn" onclick="removeFromCart(${item.id})">Eliminar</button>
        </div>
      </div>
    </div>`;
  });
  html += `<div style="text-align:right;margin-top:12px"><strong>Total: ${formatMoney(total)}</strong></div>`;
  html += '</div>';
  cont.innerHTML = html;
}

function changeQty(id, diff){
  const cart = getCart();
  const products = getProducts();
  const item = cart.find(i=>i.id===id);
  const p = products.find(x=>x.id===id);
  if(!item || !p) return;
  let newQ = item.q + diff;
  if(newQ < 1) newQ = 1;
  if(newQ > p.stock) newQ = p.stock;
  item.q = newQ;
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
  showToast('Eliminado del carrito');
}

/* ---- Simulated payment ---- */
function simulatedPayment(){
  const cart = getCart();
  if(cart.length===0){ showToast('Carrito vacío'); return; }
  // Validate stock
  const products = getProducts();
  for(const item of cart){
    const p = products.find(x=>x.id===item.id);
    if(!p || p.stock < item.q){
      showToast('Stock insuficiente para '+ (p ? p.name : 'producto'));
      return;
    }
  }
  // Deduct stock
  cart.forEach(item=>{
    const p = products.find(x=>x.id===item.id);
    p.stock -= item.q;
  });
  saveProducts(products);

  // Save order
  const orders = JSON.parse(localStorage.getItem(LS_ORDERS) || "[]");
  const form = document.getElementById('checkout-form');
  const nombre = form ? document.getElementById('nombre').value : 'Anónimo';
  const correo = form ? document.getElementById('correo').value : '';
  const order = {
    id: Date.now(),
    name: nombre,
    email: correo,
    items: cart,
    total: cart.reduce((s,it)=> s + (products.find(p=>p.id===it.id).price * it.q), 0),
    date: new Date().toISOString()
  };
  orders.push(order);
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders));

  // Clear cart
  saveCart([]);
  renderCartPage();
  updateCartCount();
  showToast('Pago simulado realizado. ¡Gracias!');
}

/* ---- Utilities ---- */
function formatMoney(n){ return '$' + n.toFixed(2); }
function viewDetail(id){ location.href = 'producto.html?id=' + id; }

/* ---- Category buttons ---- */
function setupCategoryButtons(){
  const buttons = document.querySelectorAll('.cat-btn');
  buttons.forEach(b=>{
    b.addEventListener('click', (e)=>{
      buttons.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderProducts(b.dataset.cat);
    });
  });
}

/* ---- View helpers ---- */
function renderProductsIfOnIndex(){
  if(document.getElementById('productos')) renderProducts();
}
renderProductsIfOnIndex();

/* ---- Simple export for debugging in console ---- */
window.__SC = {
  getProducts, saveProducts, getCart, saveCart, simulatedPayment
};
