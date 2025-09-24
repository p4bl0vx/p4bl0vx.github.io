---
title: "Explorando un router via UART para instalar una backdoor"
description: "Mi primer proyecto trabajando con un router y herramientas de hardware hacking."
publishDate: 2025-09-24
tags: ["router", "firmware", "reversing", "hardware", "buspirate", "uart"]
category: "hardware"
visible: false
image: ""
---

Hace unos días encontre en mi casa un router antiguo, el C54BRS4 de Conceptronics, una vieja gloria de principios de los 2000.
Siempre me ha llamada la atención la posts de gente buscando CVEs en dispositivos IoT y aunque yo no tengo aún la experiencia 
necesaría para algo así, si que me las puedo apañar para obtener una shell en un router de hace 20 años. 

# Análisis inicial
La superficie de ataque en este router no era muy grande, por un lado tiene una interfaz web y un servicio de diagnóstico
expuestos a la LAN, por otro lado existe la posibilidad de intentar de forma física. Al final me decante por la segunda, así ya tenía
una buena excusa para desempolvar mis "habilidades" de hardware hacking.

Con un objetivo en mente empiezo a desmontar el router, unos pocos tornillos y ya tengo acceso a la placa. Ahora empieza el análisis
visual, identificar el chip, memorias, y lo más importantes puertos a donde engancharme como el UART. El router cuenta con un RTL8166, un controlador de red fabricado por Realtek, la memoria flash es una 29LV160BBTC-90 y con el material que tengo actualmente me es imposible 
intentar dumpear el firmware.

Siguiendo con la inspección me encontré con un grupo de 4 pines que para mi suerte ya venían soldados. Este grupo de pines era probablemente
el puerto UART que estaba buscando.

# Investigación del puerto UART
Antes de conectarme al puerto debía confirmar que efectivamente era el puerto UART y que era cada PIN, ya que en la placa no lo indica. Este tipo de puertos como el UART o el JTAG no suelen estar muy a la vista, la de este router que lleva los pines soldados es bastante raro.

## Protocolo UART
El protocolo UART (Universal Asynchronous Receiver-Transmitter) s una interfaz serie asíncrona muy común en dispositivos embebidos. Utiliza dos lineas la de transmisión (TX) y la de recepción (RX). En dispositivos como los routers se utiliza como una consola de depuración que muestra información del arranque y que en muchos casos permite acceder a una shell.

UART es como una conversación entre dos dispositivos usando solo un cable para enviar y otro para recibir. En vez de hablar a la vez, se turnan y mandan los datos en “paquetes” muy simples. Cada paquete empieza con un bit de inicio (para avisar de que viene información), luego vienen los bits de datos (normalmente 8, que forman el byte), opcionalmente un bit de paridad para comprobar errores, y finalmente uno o dos bits de parada que marcan el final.

Como no hay una señal de reloj compartida, ambos extremos tienen que ponerse de acuerdo antes en la velocidad (baud rate) y en cómo van a empaquetar esos bits, el formato. Si no coinciden, lo que aparece en pantalla es texto ilegible.

## Detectando los pines
Ahora que sabemos como funciona UART, hay que buscar cual el la linea TX y cual la RX, adicionalmete tiene un pin GND y otro VCC (3.3V o 5V). Vamos a empezar por localizar el GND, para ello lo más facil es usar el modo continuidad del multímetro. Una punta la ponemos en una toma a tierra del router como puede ser la parte metálica de un botón, de un puerto (ej: ethernet)... Despues vamos probando uno por uno los
pines con la otra punta, la que haga que el valor del multímetro se quede cerca de 0 es el GND. Para el VCC usaremos el modo DC, enchufamos el router y con la punta negra en el GND vamos probando pines, uno de ellos debería de quedarse estable en 3.3V o 5V, otro de los pines dara medidas parecidas pero no un valor estable, ese es el TX.

## Primera lectura del UART
Ahora que ya sabía lo que es cada pin podía conectar el analizador lógico para poder sacar el baudrate e intentar leer lo que se envía por el UART. La conexión es sencilla el GND al GND del UART y dos de los cables de análisis a TX y RX, se empieza la captura y se enciende el router, una de las lineas empezara a mostrar señales, el TX, dejamos unos segundos y terminamos la  captura. Ahora solo hace falta la extensión de Logic para sacar el baudrate, el más cercano a la estimación es .... Ponemos el analizador async serial, dejando todo por defecto, menos el baudrate ya se puede leer la salida del UART.

