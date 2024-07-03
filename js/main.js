//cuerpo principal

let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let color;
let grosor;

let mouseUp = true;
let mouseDown = false;
let miPen = null;
let penClick = false;

function colorlapiz(c) {
    color = c;
}
function grosorlinea(g) {
    grosor = g;
}

let miImagen = null;

//comportamiento del mouse 
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseUp = false;
    miPen = new Pen(e.offsetX, e.offsetY, color, ctx, grosor);
})

canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    mouseUp = true;
    miPen = null;
})

/*en el mousemove, si el mouseDown es true y si se hizo click en el lapiz, 
mover el lapiz segun la posicion del mouse y dibujar */ 
canvas.addEventListener('mousemove', (e) => {
    if (mouseDown == true && penClick == true) {
        miPen.moveTo(e.offsetX, e.offsetY);
        miPen.draw();
    }

})

//button del lapiz cuando se hace click 
document.getElementById("pen").addEventListener("click", (e) => {
    penClick = true;
    penWidth = 5;
    // color = 'black';
})

//button goma de borrar
document.getElementById("borrador").addEventListener("click", (e) => {
    penClick = true;
    penWidth = 10;
    color = 'white';
})

//Guardar imagen
document.getElementById("save").addEventListener("click", (e) => {
    let link = document.createElement('a');  //crea un <a> y guarda en la variable link
    link.download = "canvas.png"; // le asigna un nombre de descarga
    link.href = canvas.toDataURL(); //establece la URL como la imagen generada en el canvas
    link.click(); //descarga la imagen
})


//carga de imagen a traves de un input type file
let fileInput = document.getElementById("file");
fileInput.addEventListener("change", (e) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    miImagen = new Image(); 
    miImagen.src = URL.createObjectURL(e.target.files[0]); //LEE EL ARCHIVO QUE CARGAMOS
    miImagen.onload = function () {
        let widthImg = miImagen.width;
        let heightImg = miImagen.height

        let x = (canvasWidth - widthImg) / 2;
        let y = (canvasHeight - heightImg) / 2;
        let aspectRatio = miImagen.height / miImagen.width;
        let height = canvasWidth * aspectRatio;
        miimg = new Imagen(miImagen, ctx, x, y, canvasWidth, height)
        miimg.drawImg();
        for (let i = 0; i < buttonsFiltro.length; i++) {
            buttonsFiltro[i].disabled = false;
            buttonsFiltro[i].classList.remove("buttonDisabled");
            
        }
    }

})


//button para resetear el canvas como nuevo
let resetCanvas = document.getElementById("resetCanvas");
resetCanvas.addEventListener("click", (e) => {
    miImagen= null;  //vuelve la imagen null
    fileInput.value= ""; //le asigna el valor del input de cargar imagen como vacio
    disabledBotones(); //llama a la funcion para deshabilitar los botones de filtro
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); //limpia el canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight) //vuelve a dibujarlo 
})


/*--------------------BOTONES DE LOS FILTROS-------------*/ 


//button para resetear los filtros aplicados a las imagenes
document.getElementById("resetImg").addEventListener("click", (e) => {
    miimg.resetImg();
    
})

//brillo a la imagen a traves de un input range
const inputBrillo = document.getElementById('brillo');
inputBrillo.addEventListener('input', function () {
    miimg.drawImg();
    // const imagenOriginal = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    miimg.brillo(this.value)
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);

});

//button para filtro negativo a la imagen
let negativo = document.getElementById("negativo")
negativo.addEventListener("click", (e) => {
    miimg.negativo();
})

//button para filtro sepia a la imagen
let sepiabotton = document.getElementById("sepia");
sepiabotton.addEventListener("click", (e) => {
    miimg.sepia();
})

//button para filtro blanco y negro
let grisBotton = document.getElementById("byn");
grisBotton.addEventListener("click", (e) => {
    miimg.gris()
})

//button para filtro de saturacion
let saturacion = document.getElementById("saturacion");
saturacion.addEventListener("click", (e) => {
    miimg.saturacion();
})

//button para filtro blur o desenfoque de la imagen
let blurbutton = document.getElementById("blur");
blurbutton.addEventListener("click", (e) => {
    miimg.blur();
})

//button para filtro binarizacion de la imagen
let binarizacionButton = document.getElementById("binarizacion")
binarizacionButton.addEventListener("click", (e) => {
    miimg.binarizacion();
})

//button para filtro detencion de bordes
let detencionBordes = document.getElementById("detencion-bordes")
detencionBordes.addEventListener("click", (e) => {
    miimg.detencionBordes();
})

/*agarro los botones que tengan la clase buttonFiltro y los guardo en la variable, 
como se guarda en forma de arreglo en la funcion recorro todos los botones que se 
guardaron en la variable y aplico a cada uno el .disabled = true para deshabilitar
los botones y le agrego una clase nueva para cambiar su estilo*/
let buttonsFiltro = document.getElementsByClassName("buttonFiltro");
function disabledBotones(){
    if (this.miImagen == null) {
        for (let i = 0; i < buttonsFiltro.length; i++) {
            buttonsFiltro[i].disabled = true;
            buttonsFiltro[i].classList.add("buttonDisabled");
            
        }
    }
}
function main() {
    disabledBotones();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}
