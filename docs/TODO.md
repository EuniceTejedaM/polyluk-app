Los signos vitales algunos ni siquiera llevan punto decimal

Hay que checar el error de cuando queremos agregar un perro, su dispositivo, nos muestra un error de que el dispositivo ya fue seleccionado, pero no nos deja añadir otro dispositivo o al menos no lo muestra, unicamente hay una opcion entre los dispositivos "disponibles" 

necesito que me ayudes a hacer que esta app no dependa de los dispositivos en la BD de manera 100% fija. Es decir que necesito que si una persona quiera registrar un perro, simplemente deba de seleccionar que tipo de dispositivo es (
    collar, pechera o arnes tactico.)
y que esto sea lo que se registre en la bd, no el dispositivo en sí, porque si no, cada vez que se quiera registrar un perro nuevo, se tendría que agregar un nuevo dispositivo a la base de datos, lo cual no es práctico ni escalable.

Asi separamos funciones. 

Collar
Solo tendra ritmo cardiaco, estres y gps. 

Pechera
Tendra ritmo cardiaco, estres, gps y temperatura y oxigeno en sangre.

Arnes tactico
Tendra ritmo cardiaco, estres, gps, temperatura y oxigeno en sangre.
Detector de golpes o caidas.

Ademas, cada vez que se registre un perro nuevo, se le asignara un ID unico y se guardara en la base de datos junto con el tipo de dispositivo que se le asigno (collar, pechera o arnes tactico). De esta manera, cuando se quiera consultar la informacion de un perro en particular, se podra hacer a traves de su ID unico y se sabra que tipo de dispositivo tiene asignado y se mostraran unicamente los signos vitales correspondientes a ese tipo de dispositivo de manera simulada (como ya esta)