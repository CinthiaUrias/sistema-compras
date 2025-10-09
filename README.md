Sistema de compras - Prototype
=============================
Proyecto: Sistema de compras (Electrónicos)
Propósito: Prototipo funcional para respaldar la actividad de backlog y sprints.
Tecnologías: HTML, CSS, JavaScript (sin backend). Persistencia local: localStorage.

Archivos
- index.html: listado de productos y navegación por categorías.
- producto.html: detalle de producto y adicionar al carrito.
- carrito.html: ver carrito, modificar cantidades y pagar (simulado).
- estilos.css: estilos responsivos y neutros.
- script.js: lógica de productos, carrito, persistencia, inventario, y pago simulado.
- README.md: este archivo.

Instrucciones rápidas
1. Descomprime y abre `index.html` en tu navegador (o sube la carpeta a GitHub Pages).
2. Prueba agregar productos al carrito, ir a carrito y realizar el 'pago simulado'.
3. El sistema persiste el carrito y los stocks en localStorage, así que los cambios permanecen en tu navegador.
4. Para resetear datos (stocks originales), abre la consola y ejecuta:
   localStorage.removeItem('sistema_compras_products_v1');
   localStorage.removeItem('sistema_compras_cart_v1');
   localStorage.removeItem('sistema_compras_orders_v1');
   location.reload();

Cómo subir a GitHub
1. Crea un repositorio público en GitHub.
2. Desde tu terminal:
   git init
   git add .
   git commit -m "Prototipo: sistema de compras - Electrónicos"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/REPO.git
   git push -u origin main

Nota
- Este prototipo es front-end y usa localStorage para simular persistencia e inventario.
- Las transacciones son simuladas (sandbox). Si necesitas integración real con una pasarela, puedo añadir un ejemplo con Stripe/PayPal (sandbox) después.
