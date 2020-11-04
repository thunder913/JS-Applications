function attachEvents() {
    let listOrCreateUrl = 'https://fisher-game.firebaseio.com/catches.json';
    

    //Getting the needed queries
    let catchesDiv = document.querySelector('#catches');
    let loadButton = document.querySelector('.load');
    let addButton = document.querySelector('.add');
    let addForm = document.querySelector('#addForm');
    let anglerInput = addForm.querySelector('.angler');
    let weightInput = addForm.querySelector('.weight');
    let speciesInput = addForm.querySelector('.species');
    let locationInput = addForm.querySelector('.location');
    let baitInput = addForm.querySelector('.bait');
    let captureTimeInput = addForm.querySelector('.captureTime');

    addButton.addEventListener('click', ()=> onAddButtonClick())
    loadButton.addEventListener('click', ()=> onLoadButtonClick());
    
    //Clicking the update button updates the details on the current catch
    function onUpdateButtonClick(e){
        let div = e.target.parentElement;
        let id = div["dataset"].id;
        //Getting the new values
        let angler = div.querySelector('.angler').value;
        let weight = div.querySelector('.weight').value;
        let species = div.querySelector('.species').value;
        let location = div.querySelector('.location').value;
        let bait = div.querySelector('.bait').value;
        let captureTime = div.querySelector('.captureTime').value;
        let updateURL = `https://fisher-game.firebaseio.com/catches/${id}.json`
        //Changing the value
        fetch(updateURL, {method: 'PUT', body: JSON.stringify({angler, weight, species, location, bait, captureTime})});
    }

    //Clicking the delete button removes the current catch from both the webpage and database
    function onDeleteButtonClick(e){
        let divToRemove = e.target.parentElement;
        let id = divToRemove["dataset"].id;
        //Removes the element from the webpage
        divToRemove.remove();
        let deleteURL = `https://fisher-game.firebaseio.com/catches/${id}.json`;
        //Removes the element from the database
        fetch(deleteURL, {method: 'DELETE', body: {id}});

    }

    //Clicking the load button reloads (shows) all the catches
    function onLoadButtonClick(){
        fetch(listOrCreateUrl)
            .then(response => response.json())
            .then(catches => {
                //If there are no catches then we dont add anything to the webpage
                if (!catches) {
                    return;
                }
                let allDivCatches = document.querySelectorAll('div.catch');
                let addedIds = [];
                //Removes all the items in the webpage
                for (const item of allDivCatches) {
                    addedIds.push(item.dataset.id);
                }
                let keys = Object.keys(catches);
                //Adds all the items from the database
                for (const key of keys) {
                    if (!addedIds.includes(key)) {
                    let currentCatch = catches[key];
                    listAnItem(key, currentCatch.angler, currentCatch.weight, currentCatch.species, currentCatch.location, currentCatch.bait, currentCatch.captureTime);
                }}
            });
    }

    //Clicking the AddButton adds only the current items on the webpage
    function onAddButtonClick(){
        //Getting all the required values
        let angler = anglerInput.value;
        let weight = weightInput.value;
        let species = speciesInput.value;
        let location = locationInput.value;
        let bait = baitInput.value;
        let captureTime = captureTimeInput.value;

        let fish = {angler, weight, species, location,bait,captureTime};
        //Adding the item in the database
        fetch(listOrCreateUrl, {method: 'POST', body: JSON.stringify(fish)})
            .then(response => response.json())
            .then(obj => listAnItem(obj.name, angler, weight, species, location, bait, captureTime));

       
    }

    //Adding the item in both the database and in the webpage
    function listAnItem(id, angler, weight, species, location, bait, captureTime){
        let divToAdd = document.createElement('div');
        divToAdd.setAttribute('class','catch');
        divToAdd.setAttribute('data-id', id);

        addItemToDiv(divToAdd, 'Angler', 'text', 'angler', angler);
        addItemToDiv(divToAdd, 'Weight', 'number', 'weight', weight);
        addItemToDiv(divToAdd, 'Species', 'text', 'species', species);
        addItemToDiv(divToAdd, 'Location', 'text', 'location', location);
        addItemToDiv(divToAdd, 'Bait', 'text', 'bait', bait);
        addItemToDiv(divToAdd, 'Capture Time', 'number', 'captureTime', captureTime);
        
        let updateButton = document.createElement('button');
        updateButton.setAttribute('class', 'update');
        updateButton.innerText = 'Update';
        updateButton.addEventListener('click',(e) => onUpdateButtonClick(e))

        let deleteButton =document.createElement('button');
        deleteButton.setAttribute('class', 'delete');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click',(e)=> onDeleteButtonClick(e));
        divToAdd.appendChild(updateButton);
        divToAdd.appendChild(deleteButton);
        catchesDiv.appendChild(divToAdd);
        }

    //Adding the item (input fields) to the div
    function addItemToDiv(divToAdd, labelName, typeValue, classValue, value){
        let label = document.createElement('label');
        label.innerText = labelName;

        let input = document.createElement('input');
        input.setAttribute('type', typeValue);
        input.setAttribute('class', classValue);
        input.setAttribute('value', value);

        divToAdd.appendChild(label);
        divToAdd.appendChild(input);
        divToAdd.appendChild(document.createElement('hr'));
    
    }

}

attachEvents();

