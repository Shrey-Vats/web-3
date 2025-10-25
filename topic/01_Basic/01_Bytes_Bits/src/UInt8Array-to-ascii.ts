
function bytesToAscii(bytesArray: number[]){
    const uint8array = new Uint8Array(bytesArray);

    return new TextDecoder().decode(uint8array);
};

const asciiString  = bytesToAscii( [ 104, 101, 108, 108, 111 ]);
console.log(asciiString)