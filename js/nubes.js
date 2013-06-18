if (window.attachEvent)
	window.attachEvent('load', iniciar);
else
	window.addEventListener('load', iniciar, false);
	
var fondo = null;
var contexto = null;

var hierba = null;
var nubes = null;
var num_nubes = 10;

var dimensiones_fondo = null;
var dimensiones_nube = { ancho : 230, alto : 54 };
var dimensiones_hierba = { ancho : [5, 20, 31], alto : 100 };
	
var imagenes = 	[
					'img/nube_2.png',
					'img/hierba_1.png',
					'img/hierba_2.png',
					'img/hierba_3.png'
				];
				
var graficos = {};
	
function iniciar()
{
	fondo = document.getElementById('fondo');
	contexto = fondo.getContext('2d');
	
	ajustar_fondo();
	
	cargar_imagenes(imagenes);
	
	if (window.attachEvent)
		window.attachEvent('resize', redimensionar);
	else
		window.addEventListener('resize', redimensionar, false);
}

function cargar_imagenes(imagenes)
{
	var numero = imagenes.length;
	
	for (var i = 0; i < imagenes.length; i++)
	{
		var imagen = new Image();
		
		imagen.onload = function() {
			numero--;
			
			if (numero == 0)
			{
				hierba = generar_hierba();
				nubes = generar_nubes();
				
				setInterval(mostrar_fondo, 30);
			}
		}
		
		imagen.src = imagenes[i];
		
		graficos[imagenes[i]] = imagen;
	}
}

function redimensionar()
{
	ajustar_fondo();
	
	hierba = generar_hierba();
	nubes = generar_nubes();
}

function ajustar_fondo()
{
	dimensiones_fondo = dimensiones_pantalla();
	
	fondo.width = dimensiones_fondo.ancho;
	fondo.height = dimensiones_fondo.alto;
}

function dimensiones_pantalla()
{
	var ancho = 630, alto = 460;
	
	if (document.body && document.body.offsetWidth) 
	{
		 ancho = document.body.offsetWidth;
		 alto = document.body.offsetHeight;
	}
	
	if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) 
	{
		 ancho = document.documentElement.offsetWidth;
		 alto = document.documentElement.offsetHeight;
	}
	
	if (window.innerWidth && window.innerHeight) 
	{
		 ancho = window.innerWidth;
		 alto = window.innerHeight;
	}
	
	return { ancho : ancho, alto : alto };
}

function generar_hierba()
{
	var hierba = [];

	var x = dimensiones_hierba.ancho[0] / 1.5;
	var y = dimensiones_fondo.alto - dimensiones_hierba.alto;

	var num = dimensiones_fondo.ancho / x;

	for (var i = 0; i < num; i++)
	{	
		var aleatorio = Math.floor(Math.random() * 2 + 1);
		var img_1 = (aleatorio == 1 ? graficos['img/hierba_1.png'] : graficos['img/hierba_2.png']);
		var img_2 = (aleatorio == 1 ? graficos['img/hierba_2.png'] : graficos['img/hierba_3.png']);
		
		var incremento = dimensiones_hierba.alto / Math.floor(Math.random() * 6 + 1)

		hierba[i] = new Hierba(i * x, 
								y + incremento, dimensiones_hierba.ancho[aleatorio - 1], 
								dimensiones_hierba.ancho[aleatorio],
								dimensiones_hierba.alto,
								img_1,
								img_2);
	}
	
	return hierba;
}

function generar_nubes()
{
	var nubes = [];
	var nube = graficos['img/nube_2.png'];
	
	for (var i = 0; i < num_nubes; i++)
	{
		var y_aleatorio = Math.floor(Math.random() * 300 + 30);
		nubes[i] = new Nube(i * dimensiones_nube.ancho, y_aleatorio, dimensiones_nube.ancho, dimensiones_nube.alto, nube);
	}
	
	return nubes;
}

function Nube(x, y, ancho, alto, img)
{
	this.avanzar = function()
	{
		if (x + ancho < 0)
			x = dimensiones_pantalla().ancho;
	
		x--;
		
		return this;
	}
	
	this.dibujar = function()
	{
		contexto.drawImage(img, x, y, ancho, alto);
		return this;
	}
}

function Hierba(x, y, ancho_1, ancho_2, alto, img_1, img_2)
{
	var contador = 1;
	
	var estados = { REPOSO : 'REPOSO', VIENTO : 'VIENTO' };
	var estado = estados.REPOSO;

	this.avanzar = function()
	{
		if (estado == estados.REPOSO)
		{
			if (contador % 400 == 0)
			{
				contador = 0;
				
				estado = estados.VIENTO;
			}
		}
		else
		{
			if (contador % 55 == 0)
			{
				contador = 0;
				
				estado = estados.REPOSO;
			}
		}
		
		contador++;
		
		return this;
	}

	this.dibujar = function()
	{
		var img = estado == estados.REPOSO ? img_1 : img_2;
		var ancho = estado == estados.REPOSO ? ancho_1 : ancho_2;
		
		contexto.drawImage(img, x - ancho, y, ancho, alto);
		
		return this;
	}
}

function mostrar_fondo()
{
	// Limpiar canvas
	contexto.clearRect (0, 0, dimensiones_fondo.ancho, dimensiones_fondo.alto);

	for (var i = 0; i < nubes.length; i++)
	{
		nubes[i].avanzar().dibujar();
	}

	for (var i = 0; i < hierba.length; i++)
	{
		hierba[i].avanzar().dibujar();
	}
}