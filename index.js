//Global Variables

const wordInput = document.querySelector('#word_input');
const showRhymesButton = document.querySelector('#show_rhymes');
const showSynonymsButton = document.querySelector('#show_synonyms');
const wordOutput = document.querySelector('#word_output');
const outputDescription = document.querySelector('#output_description')
const savedList = []
const savedWordsOutput = document.querySelector('#saved_words')


//Functions

function getRhymes(rel_rhy, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

function getSynonyms(ml, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({ml})).toString()}`)
    .then((response) => response.json())
    .then((data) => {
        callback(data);
    }, (err) => {
        console.error(err);
    });

}

function showRhymeDescription(input_word) {
    outputDescription.textContent = `Words that rhyme with ${input_word}:`

}

function showSynonymDescription(input_word) {
    outputDescription.textContent = `Words with a meaning similar to ${input_word}:`
}


function showRhymes() {
    wordOutput.innerHTML = '';
    let word = wordInput.value;
    wordOutput.textContent="Loading...";
    getRhymes(word, (results) =>{
        console.log(results);
        wordOutput.textContent="";
        if(results.length > 0){
        const groups = groupBy(results, 'numSyllables');
        for(const obj in groups) {
                const newH3 = document.createElement('h3');
                wordOutput.append(newH3);
                    if(parseInt(obj) > 1){
                        newH3.textContent = `${obj} Syllables`;
                    }
                    else{
                        newH3.textContent = `${obj} Syllable`;
                    }
                for(const item of groups[obj]) {
                const newLi = document.createElement('li');
                newLi.textContent = item.word + ' ';
                const newButton = document.createElement('button');
                    newButton.textContent = "Save";
                newLi.append(newButton);
                newButton.classList.add('btn', 'btn-outline-success', 'save');
                newButton.id = item.word;
                newButton.addEventListener('click', () => {
                newButton.disabled = true;
                let savedWord = newButton.id;
                    if (savedWordsOutput.textContent === "(none)") { 
                        savedWordsOutput.textContent = savedWord
                    }
                    else {
                        savedWordsOutput.textContent += ", " + savedWord;
                    }
                });
            wordOutput.append(newLi);
            showRhymeDescription(word);        
    }}}
        else {
        wordOutput.textContent = "(No results)"
        }
    })
}

function showSynonyms() {
    wordOutput.innerHTML = '';
    let word = wordInput.value;
    wordOutput.textContent="loading...";
    getSynonyms(word, (results) =>{
    wordOutput.textContent="";
        if(results.length > 0){
            for(const obj of results){
            const newLi = document.createElement('li');
            newLi.textContent = obj.word + ' ';
            const newButton = document.createElement('button');
            newButton.textContent = "Save";
            newLi.append(newButton);
            newButton.classList.add('btn', 'btn-outline-success', 'save');
            newButton.id = obj.word;
            newButton.addEventListener('click', () => {
                let savedWord = newButton.id;
                    if (savedWordsOutput.textContent === "(none)") { 
                        savedWordsOutput.textContent = savedWord
                    }
                    else {
                        savedWordsOutput.textContent += ", " + savedWord;
                    }
                })
            wordOutput.append(newLi);
            showSynonymDescription(word);        }
        }
        else {
            wordOutput.textContent = "(No results)"
        }
    })
}

function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}




//EVENT LISTENERS

showRhymesButton.addEventListener('click', () => {
    showRhymes()
})

showRhymesButton.addEventListener('keypress', (e) =>{
    if(e === 'Enter'){
        showRhymes()
    }
})
    
showSynonymsButton.addEventListener('keypress', (e) => {
    if(e === 'Enter') {
        showSynonyms();
    }
})

showSynonymsButton.addEventListener('click', () => {
    showSynonyms(); 
})

