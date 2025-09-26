// Bytes to Ascii 
function BytesToAsciiMap(byteArray: number[]){
    return byteArray.map((byte) => String.fromCharCode(byte)).join('');
}
function BytesToAsciiNormal(byteArray: number[]){
    return String.fromCharCode(...byteArray);
}

const bytes = [72, 101, 108, 108, 111];
const asciiStringMap  = BytesToAsciiMap(bytes);
const asciiStringNormal = BytesToAsciiNormal(bytes)

// console.log("BytesToAsciiMap :- " + asciiStringMap);
// console.log("BytesToAsciiNormal :- " + asciiStringNormal)


// Ascii to bytes
function asciiToBytes(asciiString: string){
    const byteArray = [];
    for(let i =0; i < asciiString.length; i ++){
        const byte = asciiString.charCodeAt(i);
        byteArray.push(byte);
    };
    return byteArray
}

const asciiString = "hello";
const asciiByte = asciiToBytes(asciiString);
console.log(asciiByte)