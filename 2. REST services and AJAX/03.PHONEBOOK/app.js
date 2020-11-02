    function attachEvents() {
        let loadButton = document.querySelector('#btnLoad');
        let createButton = document.querySelector('#btnCreate');
        let getOrPostURL = `https://phonebook-nakov.firebaseio.com/phonebook.json`;
        let ulPeople = document.querySelector('#phonebook');
        let personInput = document.querySelector('#person');
        let phoneInput = document.querySelector('#phone');
        loadButton.addEventListener('click', ()=> onLoadButtonClick());

        let regexName = /^[\w ]*/;
        let phoneNumberRegex = /\w*$/;
        createButton.addEventListener('click', ()=> onCreateButtonClick());

        function onLoadButtonClick(){
            fetch(getOrPostURL)
                .then(response => response.json())
                .then(people => {
                    ulPeople.innerHTML = '';
                    if (!people) {
                    return;    
                    }
                    let peopleKeys = Object.keys(people);
                    for (const key of peopleKeys) {
                        let liElement = document.createElement('li');
                        let currentPerson = people[key];
                        liElement.innerText = `${currentPerson.person}: ${currentPerson.phone}`;
                        
                        let deleteButton = document.createElement('button');
                        deleteButton.innerText = 'Delete';

                        deleteButton.addEventListener('click', (e)=>onDeleteButtonClick(e))
                        liElement.appendChild(deleteButton);
                        ulPeople.appendChild(liElement);
                    }
                });
        }

        function onDeleteButtonClick(e){
            let liElement = e.target.parentElement;
            let personWithNumber = liElement.innerText;
            personWithNumber = personWithNumber.slice(0, personWithNumber.length -6);
            let name = personWithNumber.match(regexName)[0];
            let number = personWithNumber.match(phoneNumberRegex)[0];
            let currentKey = '';
            //(Repeating) Tried putting it in a function but fetch returns promise
            fetch(getOrPostURL)
                .then(response => response.json())
                .then(people=>{
                    let keys = Object.keys(people);
                    for (const key of keys) {
                        if (people[key].person === name && people[key].phone=== number) {
                            currentKey = key;
                            break;
                        }
                    }
                })
                .then(()=>{
                    let deleteURL = `https://phonebook-nakov.firebaseio.com/phonebook/${currentKey}.json`
                    fetch(deleteURL, {method: 'DELETE'})
                })


        }

        function onCreateButtonClick(){
            {
                fetch(getOrPostURL, 
                    {method: 'POST',
                    headers: { 'Content-type': 'application/json' }, 
                    body: JSON.stringify({person: personInput.value, phone: phoneInput.value}),})
                    .then(()=>{
                        onLoadButtonClick();
                        personInput.value = '';
                        phoneInput.value = '';
                    });
        
                    
            }
        }
    }

    attachEvents();