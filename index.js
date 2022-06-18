(document.readyState == 'loading') ? document.addEventListener('DOMContentLoaded', ready) : ready();

class Producto {
  constructor(id, nombre, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

const productosACargar = [];

var DateTime = luxon.DateTime;
const fechaAhora = DateTime.now().setLocale('arg').toLocaleString(DateTime.DATETIME_FULL);

function ready(){

  fetch ('./data.json')
    .then ((res) => res.json())
    .then((data) => {
    data.forEach((producto) => {
        const cadaProducto = document.createElement("div");
        cadaProducto.innerHTML = `<div class="card" id = "${producto.id}">
                                  <div class="shop-item">
                                        <img class="imagen-card" src="${producto.img}" alt="${producto.nombre}" style="height:50px"><br>
                                        <span class="nombre-card">${producto.nombre}</span>
                                        <div class="detalles-producto">
                                            <span class="precio-card">$${producto.precio}</span>
                                             <button class="anadirCarrito" type="button">Añadir al Carrito</button>
                                  </div>
                                  <div id="snackbar">Producto agregado al carrito</div>
                                  </div>  `;
        document.getElementById("columna").appendChild(cadaProducto);
      });
     
      
    let botonSumarProducto = document.getElementsByClassName(
        "anadirCarrito"
    );
    for (let i = 0; i < botonSumarProducto.length; i++) {
        let boton = botonSumarProducto[i];
        boton.addEventListener('click', agregarProductoCarrito);
    }
  

    let cantidadInputs = document.getElementsByClassName(
        "cantidad-carrito-input"
    );
    for (let i = 0; i < cantidadInputs.length; i++) {
        let input = cantidadInputs[i];
        input.addEventListener('change', cambioCantidad);
    }

    let botonRemoverProducto = document.getElementsByClassName("btn-remover");
    for (let i = 0; i < botonRemoverProducto.length; i++) {
        let boton = botonRemoverProducto[i];
        boton.addEventListener('click', removerProducto);
    }

    let fecha = document.createElement("div");
    fecha.innerHTML = `<div class = 'footerFecha'>${fechaAhora}</div>`
    document.getElementById("fecha").appendChild(fecha);

    document.getElementsByClassName('btn-Compra')[0].addEventListener('click', compraClick);

    document.getElementsByClassName('btn-contacto')[0].addEventListener('click', mostrarContacto);
    document.getElementsByClassName('btn-ayuda')[0].addEventListener('click', mostrarAyuda);

    obtenerProductosDeLocalStorage();
    obtenerTotalDeLocalStorage();
  }); 
}

function mostrarContacto(){
  Swal.fire({
    icon: 'info',
    title: 'Formas de Contacto',
    text: `tel: XXXX-XXX-XXXX /\n` + 
          `XX-XXXX-XXXX\n` +
          `tienda@xxxxxxx.com`,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
}


function mostrarAyuda(){
  Swal.fire({
    icon: 'question',
    title: 'Ayuda',
    text: `Seleccione los productos que desea comprar presionando el botón "Añadir al Carrito".\n` +
          `Cuando desee terminar su compra, presione el botón "COMPRAR CARRITO".`,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
}

function compraClick(){
  Swal.fire(
    'Gracias por su compra!',
    'Vuelva pronto!',
    'success'
  )
    let productosCarrito = document.getElementsByClassName('productos-carrito')[0]
    while (productosCarrito.hasChildNodes()){
        productosCarrito.removeChild(productosCarrito.firstChild)
    }
    localStorage.clear();
    document.getElementsByClassName("precio-total-carrito")[0].innerText = "$"+0
}

function removerProducto(evento) {
    let clickBoton = evento.target;
    clickBoton.parentElement.parentElement.remove();
    cargarProductosAlLocalStorage();
    document.getElementsByClassName("precio-total-carrito")[0].innerText = "$"+0
    actualizarTotalCarrito();
}

function cambioCantidad(evento) {
    let input = evento.target;
    (isNaN(input.value) || input.value <=0) && (input.value = 1);  
    actualizarTotalCarrito();
}


function avisoCarritoPop() {
    let avisoCarrito = document.getElementById("snackbar");
    avisoCarrito.className = "ver";
    setTimeout(function () {
      avisoCarrito.className = avisoCarrito.className.replace("ver", "");
    }, 1000);
}

function agregarProductoCarrito(evento) {
    let boton = evento.target
    let productoTienda = boton.parentElement.parentElement
    let titulo = productoTienda.getElementsByClassName("nombre-card")[0].innerHTML;
    let precio = productoTienda.getElementsByClassName("precio-card")[0].innerHTML;
    let imagen = productoTienda.getElementsByClassName("imagen-card")[0].innerHTML;
    
    agregarProductoAlCarrito(titulo, precio, imagen);
    añadirAProductosACargar(titulo, precio, imagen);
    actualizarTotalCarrito();
    avisoCarritoPop();
}
  
function agregarProductoAlCarrito(titulo, precio, imagen) {
    let filaCarrito = document.createElement("div")
    filaCarrito.classList.add('fila-carrito')
    let miCarrito = document.getElementsByClassName('productos-carrito')[0]
    let nombresProductosCarrito = miCarrito.getElementsByClassName('carrito-titulo-producto')
    for (let i = 0; i < nombresProductosCarrito.length; i++) {
        if (nombresProductosCarrito[i].innerText == titulo) {
            alert('Este objeto ya ha sido añadido.')
            document.getElementsByClassName("cantidad-carrito-input")[i].value = i++;
            return
        }
    }
    let contenidoFilaCarrito = ` <div class="producto-carrito columna-carrito">
                                    <img class= "carrito-imagen-producto" src="${imagen}" width="100" height="100"
                                    <span class= "carrito-titulo-producto">${titulo}</span>
                                  </div>  
                                    <span class="precio-carrito columna-carrito">${precio}</span>
                                  <div class="cantidad columna-carrito">
                                    <input class="cantidad-carrito-input" type="number" value="1">
                                    <button class="btn-remover" type="button">REMOVER</button>
                                  </div>`;
    filaCarrito.innerHTML = contenidoFilaCarrito  
    miCarrito.append(filaCarrito)
    filaCarrito.getElementsByClassName('btn-remover')[0].addEventListener('click', removerProducto)
    filaCarrito.getElementsByClassName('cantidad-carrito-input')[0].addEventListener('change', cambioCantidad)
}
  
function actualizarTotalCarrito() {
    let contenedorProductoCarrito =
      document.getElementsByClassName("productos-carrito")[0];
    let filasCarrito =
      contenedorProductoCarrito.getElementsByClassName("fila-carrito");
    let total = 0;
    for (let i = 0; i < filasCarrito.length; i++) {
      let filaCarrito = filasCarrito[i];
      let precioProducto =
        filaCarrito.getElementsByClassName("precio-carrito")[0];
      let cantidadProducto = filaCarrito.getElementsByClassName(
        "cantidad-carrito-input"
      )[0];
      let precio = parseFloat(precioProducto.innerText.replace("$", ""));
      let cantidad = cantidadProducto.value;

      total = total + precio * cantidad,
      (total = Math.round(total * 100) / 100),
      document.getElementsByClassName("precio-total-carrito")[0].innerText = "$"+total; 

      
      cargarProductosAlLocalStorage();
      cargarTotalAlLocalStorage();
    }
    
    function cargarTotalAlLocalStorage(){
      localStorage.setItem("totalStorage", document.getElementsByClassName("precio-total-carrito")[0].innerText);
    }    
}

function añadirAProductosACargar(titulo, precio, imagen){
  let producto = {titulo, precio, imagen}
  productosACargar.push(producto);
}

function cargarProductosAlLocalStorage(){
  localStorage.setItem("carrito", JSON.stringify(productosACargar));
}

function obtenerProductosDeLocalStorage(){
  if(localStorage.getItem("carrito" != null)){
    let carritoJSON = localStorage.getItem("carrito")
    let carritoObtenido = JSON.parse(carritoJSON)
    carritoObtenido.forEach(element => { 
    let titulo = element.titulo
    let precio = element.precio
    let imagen = element.imagen
    agregarProductoAlCarrito(titulo, precio, imagen);
  })
}
}

function obtenerTotalDeLocalStorage(){
  if(totalStorage.getItem("totalStorage") != null){
    let totalStorage = localStorage.getItem("totalStorage")
    let total2 = totalStorage.substring(1)
    document.getElementsByClassName("precio-total-carrito")[0].innerText = "$"+total2; 
  }
}  