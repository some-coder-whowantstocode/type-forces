const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

module.exports.generateText = async (numbers, symbols, size) => {
    try {
        let output = "";
        const englishData = await readFileAsync('helpers/static/english.json', 'utf8');
        const numberData = await readFileAsync('helpers/static/number.json', 'utf8');
        const symbolData = await readFileAsync('helpers/static/symbols.json', 'utf8');

        const english = JSON.parse(englishData);
        const number = JSON.parse(numberData);
        const symbol = JSON.parse(symbolData);

        let words = english.words;

        if (numbers) {
            words = [...words, ...number.words];
        }

        if (symbols) {
            words = [...words, ...symbol.words];
        }

        // Shuffle array
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        const checker = /[\[\]\(\)\{\}\"\'\<\>\`\'\'\'\']/g;
        const symboltest = /[\!\@\#\$\%\^\&\*\-\_\=\+\|\;\"\:\,\.\/\?\~]|(\(\))|(\[\])|(\{\})|(\<\>)|(\'\')|(\`\`)/g;

        for (let i = 0; i < size; i++) {
            let pos = Math.round(Math.random() * (words.length - 1));
            let word = words[pos];
            if (symboltest.test(word)) {
                let newpos = Math.round(Math.random() * (english.words.length - 1));
                if (checker.test(word)) {
                    word = word[0] + english.words[newpos] + word[1];
                } else {
                    word += english.words[newpos];
                }
            }
            output +=word;
            if(i<size-1){
                output += " ";
            }
        }
        return output;
    } catch (error) {
        console.log(error);
    }
};
