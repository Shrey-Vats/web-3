function asciiToBytes(value: string){
    return new Uint8Array([...value].map(char => char.charCodeAt(0)));
};

const ascii = "hello";
const bytesArray = asciiToBytes(ascii);
console.log(bytesArray)