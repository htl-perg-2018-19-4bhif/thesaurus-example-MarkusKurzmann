import { Dictionary } from "lodash";

let ar = new Array();
let lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('openthesaurus.txt')
});

//read the file line by line
lineReader.on('line', function (line) {
    ar.push(line);
});

lineReader.on('close', function (line) {
    //check if there were any words passed to the program
    if(process.argv.length < 3){
        console.log("Please choose some words for the thesaurus...");
    }else{

        let words: string[] = new Array();
        let synonyms : Dictionary<string> = {
            "key": "value"        
        }
        
        for(var i = 2; i < process.argv.length; i++){
            words[i-2] = process.argv[i];
            synonyms[words[i-2]] = words[i-2];
        }

        for(var i = 0; i < ar.length; i++){
            let line: string[] = ar[i].split(";");
            
            //found valid line
            if(line.length > 1){

                //check for every word you pass to your program
                for(var w = 0; w < words.length; w++){

                    //inspect every word in a valid line if its the same like the word you are searching
                    for(var j = 0; j < line.length; j++){

                        //check if word appears in line
                        //full match
                        if(line[j] === words[w]){
                            for(var k = 1; k < line.length; k++){
                                synonyms[words[w]] += ", " + line[k];
                            }
                        }else{
                            //half match
                            if(line[j].indexOf(words[w]) >= 0){
                                //word appears in line -> save rest of line
                                for(var k = 1; k < line.length; k++){
                                    
                                    //check if the word is already in words defined
                                    if(words.indexOf(line[j]) <= 0){
                                        if(words[line[j]] === undefined){
                                            words.push(line[j]);
                                            words[line[j]] = ",";
                                        }
                                    }else{
                                        if(synonyms[line[j]] !== undefined){
                                            if(synonyms[line[j]].indexOf(line[k]) < 0){
                                                synonyms[line[j]] += ", " + line[k];
                                            }else{
                                                //do nothing
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }
                        
                    }
                }
                
            }
        }
        for(var i = 0; i < words.length; i++){
            let wordsSplit: string[] = synonyms[words[i]].split(",");
            if(wordsSplit.length > 1){
                console.log("Found synonyms for '",words[i], "':");
            
                for(var j = 0; j < wordsSplit.length; j++){
                    if(wordsSplit[j] === "undefined" || wordsSplit[j] === null || wordsSplit[j] === ""|| wordsSplit[j] === words[i]){
                        continue;
                    }else{
                        console.log("\t",wordsSplit[j]);
                    }
                }
            }else{
                console.log("No synonyms found for '",words[i],"'");
            }
            
        }
    }
});
