import { log, getHi } from './b';

log();

document.body.onclick = () => alert(0);
document.body.onclick = () => alert(1);
document.body.appendChild(getHi('Yerevan'));


function A(a, b) {

}

function B() {

}

B.prototype = new A;
console.log((new B()).constructor.name);
