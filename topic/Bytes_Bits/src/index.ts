//Representing bits and bytes in JS

//bits
const x = 0;
console.log(x)

//bytess 
const y = 266;
console.log(y);

//array of bytes 
const bytes = [255, 67, 99, 189];
console.log(bytes);

//A better way to represent an array of bytes
let newArr = new Uint8Array([0, 0, 255, 230, 170])
console.log(newArr)

newArr[1] = 330;
console.log(newArr)