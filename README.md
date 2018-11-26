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
### Crear el primer nodo de la red
Cada nodo que se crea necesita la direcci&oacute;n donde se pagar&aacute;n las recompensas por el minado
```javascript
const Node = require("./node");

var node1 = new Node("account-1");
```
### Crear los siguientes nodos de la red
Para crear los siguientes  nodos de la red, pasamos como par&aacute;metro algún nodo ya existente (adem&aacute;s de la ya mencionada direcci&oacute;n para recompensas)
```javascript
var node2 = new Node("account-2", node1);
var node3 = new Node("account-3", node1);
```
### Empezar a usar la red
Por ejemplo, agreg&aacute;ndole una transacci&oacute;n
```javascript
const Transaction = require("./transaction");

node1.add(new Transaction("account-1", "account-2", 23));
```
> Esta transacci&oacute;n se propagar&aacute; a todos los nodos
### Minar bloques pendientes
Cualquier nodo puede armar su bloque candidato y, al minarlo, lo propaga por la red
```javascript
node2.mine();
```
### Consultar el saldo de una cuenta
Desde cualquier nodo de la red se puede consultar el balance de una cuenta
```javascript
console.log(`El saldo de 'account-2' es ${node3.getBalanceOfAddress("account-2")}`);
```

> N&oacute;tese que la transacci&oacute;n la agregamos mediante **node1**, la minamos desde **node2** y consultamos el balance desde **node3**