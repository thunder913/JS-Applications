function attachEvents() {
    let baseUrl = `https://wild-players.firebaseio.com/`;
    let addPlayerButton = document.querySelector('#addPlayer');
    let nameInput = document.querySelector('#addName');
    let playersDiv = document.querySelector('#players');
    let canvasElement = document.querySelector('canvas');
    let saveButton = document.querySelector('#save');
    let reloadButton = document.querySelector('#reload');
    let fieldsets = document.querySelectorAll('fieldset');
    let currentPlayerDiv;
    let currentPlayerKey;
    let currentPlayer;
    addPlayerButton.addEventListener('click',()=> onAddButtonClick());

    loadAllPlayers();
    function loadAllPlayers(){
        playersDiv.innerHTML = '';
        fetch(`${baseUrl}/players/.json`)
            .then(response => response.json())
            .then(players=> {
                if (players) {
                    let keys = Object.keys(players);
                    for (const key of keys) {
                        addPlayer(key, players[key]);
                    }
                }
            })
        }
    
    reloadButton.addEventListener('click', ()=>onReloadButtonClick());
    saveButton.addEventListener('click', ()=> onSaveButtonClick());

    function onSaveButtonClick(){
        hideSaveAndReload();
        fetch(`${baseUrl}/players/${currentPlayerKey}.json`, {method:'PATCH', body:JSON.stringify(currentPlayer)})
            .then(()=> {
                currentPlayerDiv.querySelector('.money').innerText = currentPlayer.money;
                currentPlayerDiv.querySelector('.bullets').innerText = currentPlayer.bullets;
            });
        clearInterval(canvasElement.intervalId);
    }

    function onReloadButtonClick(){
            if (currentPlayer.money < 60) {
                alert(`The player has only ${currentPlayer.money}$ and does not have enough!`);
                return;
            }
            currentPlayer.money -= 60;
            currentPlayer.bullets += 6;
        }

    function onAddButtonClick(){
        if (nameInput.value === '') {
            alert('The player name must not be empty!');
            return;
        }
        let newPlayer = {name: nameInput.value, money: 500, bullets: 6};
        fetch(`${baseUrl}/players/.json`, {method:'POST', body: JSON.stringify(newPlayer)})
            .then(response => response.json())
            .then(key => addPlayer(key.name, newPlayer));
        
        nameInput.value = '';
    }

    function addPlayer(key, player){
        let divElement = document.createElement('div');
        divElement.setAttribute('class', 'player');
        divElement.dataset.id = key;
        divElement.innerHTML += getRow('Name', player.name);
        divElement.innerHTML += getRow('Money', player.money);
        divElement.innerHTML += getRow('Bullets', player.bullets);

        let playButton = document.createElement('button');
        playButton.setAttribute('class', 'play');
        playButton.innerText = 'Play';

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('class', 'delete');

        divElement.appendChild(playButton);
        divElement.appendChild(deleteButton);
        playersDiv.appendChild(divElement);
        
        deleteButton.addEventListener('click', (e)=> onDeleteButtonClick(e));
        playButton.addEventListener('click', (e)=> onPlayButtonClick(e));
    }

    function onPlayButtonClick(e){
        let playerHTML = e.target.parentElement;
        let id = playerHTML.dataset.id;
        fetch(`${baseUrl}/players/${id}.json`)
            .then(response => response.json())
            .then(player => {
                showSaveAndReload();
                loadCanvas(player)
                currentPlayer = player;
                currentPlayerKey = id;
                currentPlayerDiv = playerHTML;
            });
    }

    function onDeleteButtonClick(e){
        let toRemove = e.target.parentElement;
        let id = toRemove.dataset.id;

        fetch(`${baseUrl}/players/${id}.json`, {method: 'DELETE'});
        toRemove.remove();
    }

    function getRow(type, value){
        return `<div class="row">
                <label>${type}:</label>
                <label class="${type.toLowerCase()}">${value}</label>
            </div>`
    }
    function showSaveAndReload(){
        canvasElement.style.display = 'block';
        saveButton.style.display = 'block';
        reloadButton.style.display = 'block';
        fieldsets.forEach(x=>x.style.display = 'none');
    }
    
    function hideSaveAndReload(){
        canvasElement.style.display = 'none';
        saveButton.style.display = 'none';
        reloadButton.style.display = 'none';
        fieldsets.forEach(x=>x.style.display = 'block');
    }
}


