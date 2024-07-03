class Imagen {

    constructor(img, context, posX, posY, width, height) {
        this.img = img;
        this.ctx = context;
        this.posX = posX;
        this.posY = posY
        this.width = width;
        this.height = height;
        this.imageOriginal = null;
        this.brilloActual = 5;

    }

    drawImg() {
        //dibujo la imagen
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height); 
        
        //guardo la imagen original en una variable para luego utilizarla
        this.imageOriginal = ctx.getImageData(0, 0, this.width, this.height); 
        
    }
    resetImg() {
        //reseteo la imagen, utilizando la original que guarde en el imageOriginal
        this.ctx.putImageData(this.imageOriginal, 0, 0); 
    }

    sepia() {

        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i]; //rojo
            let g = data[i + 1];//verde
            let b = data[i + 2];//azul

            let tr = 0.393 * r + 0.769 * g + 0.189 * b; //se calculan los nuevos valores utilizando las formulas
            let tg = 0.349 * r + 0.686 * g + 0.168 * b;
            let tb = 0.272 * r + 0.534 * g + 0.131 * b;

            data[i] = tr > 255 ? 255 : tr; // si tr es mayor que 255,
            // entonces establezca el valor de data[i] en 255, sino establezca el valor de data[i] en tr
            data[i + 1] = tg > 255 ? 255 : tg;
            data[i + 2] = tb > 255 ? 255 : tb;
        }

        ctx.putImageData(imageData, 0, 0);
    }
    negativo() {
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < imageData.data.length; i += 4) {  //se recorre la data de la imagen avanzando de a 4 representando a un pixel
            imageData.data[i + 0] = 255 - imageData.data[i + 0]; //calcula rojo
            imageData.data[i + 1] = 255 - imageData.data[i + 1]; //calcula verde

            imageData.data[i + 2] = 255 - imageData.data[i + 2];//calcula azul
        }
        ctx.putImageData(imageData, 0, 0);
    }
    brillo(valor) {
        let factor = 5;
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        
        const brillo = factor * valor; 
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) { //recorre la data de la imagen
                if (data[i] < 255) { //se fija que no sea mayor a 255 
                    data[i] = data[i] + brillo; //le asigna el valor nuevo. En este caso se le suma el brillo
                }
                if (data[i + 1] < 255) {
                    data[i + 1] = data[i + 1] + brillo;
                }
                if (data[i + 2] < 255) {
                    data[i + 2] = data[i + 2] + brillo;
                }
        }
        this.brilloActual = valor; //el brillo actual pasa a ser el valor que llego desde el input
        ctx.putImageData(imageData, 0, 0);

    }
    gris() {
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) { 
            let r = data[i]; //rojo
            let g = data[i + 1];//verde
            let b = data[i + 2];//azul
            let promedio = (r + g + b) / 3 //calcula el promedio de rgb 
            data[i] = promedio; //a cada uno se le asigna el valor del promedio
            data[i + 1] = promedio;
            data[i + 2] = promedio;
        }
        ctx.putImageData(imageData, 0, 0);
    }
    saturacion() {
        let imageData = ctx.getImageData(0, 0, this.img.width, this.img.height);
        const data = imageData.data;

        const saturation = 2; // valor de saturación deseado
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const max = Math.max(r, g, b); //busca el maximo entre r g y b
            data[i] = max + saturation * (r - max); // componente rojo
            data[i + 1] = max + saturation * (g - max); // componente verde
            data[i + 2] = max + saturation * (b - max); // componente azul
        }

        ctx.putImageData(imageData, 0, 0);
    }
    blur() {
        let imageData = ctx.getImageData(0, 0, this.img.width, this.img.height);
        const data = imageData.data;
        //blur kernel
        let kernel = [
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9],
            [1 / 9, 1 / 9, 1 / 9]
        ]
        let offset = Math.floor(kernel.length / 2); //calcula el valor del desplazamiento para centrar el kernel en relacion con la img

        for (let x = offset; x < this.img.width - offset; x++) {
            for (let y = offset; y < this.img.height - offset; y++) {
                let acc = [0, 0, 0];
                for (let a = 0; a < kernel.length; a++) { //recorre kernel 
                    for (let b = 0; b < kernel.length; b++) {
                        let xn = x + a - offset;
                        let yn = y + b - offset;
            
                        let pixel = [
                            //se obtiene un pixel en la posicion (xn,yn), se multiplica por 4 por el almacenamiento de los pixeles
                            data[(yn * this.img.width + xn) * 4],
                            data[(yn * this.img.width + xn) * 4 + 1],
                            data[(yn * this.img.width + xn) * 4 + 2]
                        ];
              
                        acc[0] += pixel[0] * kernel[a][b]  //se guarda el valor de cada componente pixel multiplicado por el valor en la kernel
                        acc[1] += pixel[1] * kernel[a][b]
                        acc[2] += pixel[2] * kernel[a][b]
                    }
                }
                let indicePixel = (y * this.img.width + x) * 4;  //calcula el indice del pixel
                data[indicePixel] = acc[0]; //se asigna el valor al rojo
                data[indicePixel + 1] = acc[1]; //verde
                data[indicePixel + 2] = acc[2];//azul
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
    detencionBordes() {
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        //se definen las matrices vertical y horizontal
        let kernelx = [ 
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ]
        let kernely = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ]

        let intensity = [];
        for (let x = 0; x < imageData.width; x++) { //se recorre los pixel de la imagen horizontal
            intensity[x] = [];
            for (let y = 0; y < imageData.height; y++) { //se recorre los pixel de la img vertical
                const index = (y * imageData.width + x) * 4; //se calcula el index del pixel correspondiente a su posicion
                intensity[x][y] = (data[index] + data[index + 1] + data[index + 2]) / 3; //se calcula la intensidad, se suman los valores de rojo verde y azul y se lo divide para obtener gris
            }
        }
        for (let x = 1; x < imageData.width - 1; x++) { //se recorre los pixeles de la img menos los bordes
            for (let y = 1; y < imageData.height - 1; y++) {
                let magx = 0, magy = 0;
                for (let a = 0; a < 3; a++) { //se recorren los píxeles vecinos del píxel actual
                    for (let b = 0; b < 3; b++) {
                        const xn = x + a - 1; //se calcula el desplazamiento respecto del pixel actual
                        const yn = y + b - 1;
                        const indicePixel = (yn * imageData.width + xn) * 4;
                        magx += intensity[xn][yn] * kernelx[a][b]; //se calcula el valor del gradiente horizontal
                        magy += intensity[xn][yn] * kernely[a][b]; //se calcula el valor del gradiente vertical 
                    }
                }
                const indicePixel = (y * imageData.width + x) * 4;
                const magnitude = Math.sqrt(magx * magx + magy * magy); // se calcula la magnitud total del gradiente en el píxel actual

                data[indicePixel] = magnitude; //se le asigna el valor de la magnitud
                data[indicePixel + 1] = magnitude;
                data[indicePixel + 2] = magnitude;
                data[indicePixel + 3] = 255; //alfa= 255
            }
        }

        ctx.putImageData(imageData, 0, 0);

    }
    binarizacion() {

        //promedio de rbg y si es menor que la mitad que vaya a blanco y si es menor a negro
        //o igual que el gris pero a todo le pongo el valor del rojo
        let imageData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let promedio = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (promedio < 120) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } else {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            }

        }
        ctx.putImageData(imageData, 0, 0);

    }
}