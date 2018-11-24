# PoC - Blockchain
Esta es una Prueba de Conceptos (PoC) referidos a una blockchain descentralizada. Es una PoC porque est&aacute; orientada a ejemplificar el funcionamiento evitando aspectos t&eacute;cnicos que s&iacute; o s&iacute; deber&iacute;an ser tenidos en cuenta en una implementaci&oacute;n real.

Desarrollada en JavaScript

## Aspectos claves
### La red
* La red se organiza en nodos (_node_), cada nodo tiene su propia versi&oacute;n de la **blockchain**.
* Cada nodo est&aacute; relacionado con otros nodos a los que llama pares (_peers_).
### Documentos / Transacciones
* Los documentos (por ejemplo transferencias) ingresan a la red mediante cualquier nodo y son propagados a todos sus pares y as&iacute; sucesivamente hasta alcanzar a toda la red.
### Armado (y minado) de nuevos bloques
* Cada nodo arma su potencial pr&oacute;ximo bloque (_block_) a formar parte de la blockchain.
* Cuando un nodo mina un bloque, lo propaga a la red.
* Cuando un nodo recibe un bloque minado, lo valida, lo agrega a su blockchain, lo propaga su la red y sigue intentando minar los documentos restantes.