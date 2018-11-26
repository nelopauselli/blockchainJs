# PoC - Blockchain
Esta es una Prueba de Conceptos (PoC) referidos a una blockchain descentralizada. Es una PoC porque est&aacute; orientada a ejemplificar el funcionamiento evitando aspectos t&eacute;cnicos que s&iacute; o s&iacute; deber&iacute;an ser tenidos en cuenta en una implementaci&oacute;n real.

Desarrollada en JavaScript

## Aspectos relevantes
### La red
* La red se organiza en nodos (_node_), cada nodo tiene su propia versi&oacute;n de la **blockchain**.
* Cada nodo est&aacute; relacionado con otros nodos a los que llama pares (_peers_).
### Documentos / Transacciones
* Los documentos (por ejemplo transferencias) ingresan a la red mediante cualquier nodo y son propagados a todos sus pares y as&iacute; sucesivamente hasta alcanzar a toda la red.
### Armado (y minado) de nuevos bloques
* Cada nodo arma su potencial pr&oacute;ximo bloque (_block_) a formar parte de la blockchain.
* Cuando un nodo mina un bloque, lo propaga a la red.
* Cuando un nodo recibe un bloque minado, lo valida, lo agrega a su blockchain, lo propaga su la red y descarta los documentos pendientes que fueron incluidos en el nuevo bloque.

## Uso de la PoC
1. Crear el primer nodo de la red:
```javascript
const Node = require("./node");

var node1 = new Node("account-1");
```
2. Crear los siguientes nodos de la red, pasando como parámetro algún nodo ya existente
```javascript
var node2 = new Node("account-2", node1);
var node3 = new Node("account-3", node1);
```
3. Empezar a usar la red, por ejemplo, agreg&aacute;ndole una transacci&oacute;n
```javascript
node1.add(new Transaction("account-1", "account-2", 23));
```
> Esta transacci&oacute;n debe propagarse a todos los nodos
4. Minar bloques pendientes
```javascript
node2.mine();
```
> el minado de un bloque lo puede hacer cualquier nodo
5. Consultar el saldo de una cuenta, en cualquier nodo de la red
```javascript
console.log(`El saldo de 'account-2' es ${node3.getBalanceOfAddress("account-2")}`);
```
