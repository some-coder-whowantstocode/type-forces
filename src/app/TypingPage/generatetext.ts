export function generatetext( letters : boolean, numbers : boolean, symbols : boolean, brackets : boolean, size : number ) : string {
    const STORE ={
        letters:"abcdefghijklmnopqrstuvwxyz",
        numbers:"0123456789",
        symbols:"!@#$%^&*`~/?,.",
        brackets:"<>{}[]()"
    } 
    let strings = STORE.letters;
    let output = "";
    size = Math.max(size,30);
    if(letters){
        strings += STORE.letters;
    }
    if(numbers){
        strings += STORE.numbers;
    }
    if(symbols){
        strings += STORE.symbols;
    }
    if(brackets){
        strings += STORE.brackets;
    }

    for(let i=0;i<size;i++){
        const position = Math.random() * strings.length ;
        console.log(position)
        output += strings.at(position);
    }
    return output;
}