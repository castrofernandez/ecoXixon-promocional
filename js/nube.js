if (window.attachEvent)
	window.attachEvent('load', mostrar_nube);
else
	window.addEventListener('load', mostrar_nube, false);
	
if (window.attachEvent)
	window.attachEvent('resize', mostrar_nube);
else
	window.addEventListener('resize', mostrar_nube, false);

var canvas_nube = null;
var contexto_nube = null;

function mostrar_nube()
{
	canvas_nube = document.getElementById('frente');
	contexto_nube = canvas_nube.getContext('2d');
	
	var dimensiones_fondo = dimensiones_pantalla();
	var contenido = document.getElementById('contenido');
	
	canvas_nube.width = dimensiones_fondo.ancho;
	
	posicionar_nube();
}

var posicion_nube_sesion = null;
var centro_pantalla = null;
var rebote = null

var imagen_nube = null;

var dimensiones_nube_frente = { ancho : 600, alto : 297 };

var posicion_nube_y = 40;

var interval_frente = null;

var velocidad = 1;

// Centrado de la caja en pantalla
function posicionar_nube()
{
	posicion_nube_sesion = canvas_nube.width;
	
	centro_pantalla = posicion_nube_sesion / 2 - dimensiones_nube_frente.ancho / 2;
	rebote = centro_pantalla - dimensiones_nube_frente.ancho / 12;
	
	imagen_nube = new Image();
	
	imagen_nube.onload = function() 
	{  
		interval_frente = setInterval(
										function() { mover_nube_sesion(); }
										, velocidad);
	}
	
	imagen_nube.src = 'img/nube_sesion.png';
}

function mover_nube_sesion()
{
	// Limpiar canvas
	contexto_nube.clearRect (0, 0, dimensiones_fondo.ancho, dimensiones_fondo.alto);

	contexto_nube.drawImage(imagen_nube, posicion_nube_sesion, posicion_nube_y, dimensiones_nube_frente.ancho, dimensiones_nube_frente.alto);

	if (posicion_nube_sesion > rebote)
	{
		posicion_nube_sesion -= 40;
	}
	else 
	{
		window.clearInterval(interval_frente);
		
		interval_frente = setInterval(function() { rebote_nube(); }, velocidad);
	}
}

function rebote_nube()
{
	// Limpiar canvas
	contexto_nube.clearRect (0, 0, dimensiones_fondo.ancho, dimensiones_fondo.alto);

	contexto_nube.drawImage(imagen_nube, posicion_nube_sesion, posicion_nube_y, dimensiones_nube_frente.ancho, dimensiones_nube_frente.alto);
	
	if (posicion_nube_sesion < centro_pantalla)
		posicion_nube_sesion += 20;
	else
	{
		window.clearInterval(interval_frente)
		
		window.setTimeout(mostrar_texto, 200);
	}
}

function mostrar_texto()
{
	$('h3').css('visibility','visible').hide().fadeIn('slow');
	$('.social').css('visibility','visible').hide().fadeIn('slow');
	$('#pie').css('visibility','visible').hide().fadeIn('slow');
}