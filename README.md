# PoC of blockchain
Esta es una Prueba de Conceptos (PoC) referidos a una blockchain descentralizada. Es una PoC porque está orientada a ejemplificar el funcionamiento evitando aspectos que sí deberían ser tenidos en cuenta en una red real.

## Aspectos claves
* La red se organiza en nodos (_node_), cada nodo tiene su propia copia de la **blockchain**.
* Cada nodo está relacionado con otros nodos llamados pares (_peers_).
* Los documentos (por ejemplo transferencias) ingresan mediante cualquier nodo y son propagados por la red.
* Cada nodo arma su próximo bloque (_block_) candidato a formar parte de la blockchain.
* Cuando un nodo mina un bloque, lo propaga a la red.
* Cuando un nodo recibe un bloque minado, lo valida, lo agrega a su blockchain y lo propaga su la red.