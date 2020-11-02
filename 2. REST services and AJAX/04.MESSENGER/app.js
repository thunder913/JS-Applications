function attachEvents() {
    let submitButton = document.querySelector('#submit');
    let refreshButton = document.querySelector('#refresh');
    let nameInput = document.querySelector('#author');
    let messageInput = document.querySelector('#content');
    let messagesTextArea = document.querySelector('#messages');
    let url = `https://rest-messanger.firebaseio.com/messanger.json`;

    refreshButton.addEventListener(('click'), ()=>{
        fetch(url)
            .then(response => response.json())
            .then(result => {
                if (!!result) {
                let keys = Object.keys(result);
                messagesTextArea.textContent = '';
                for (const key of keys) {
                    let currentMessage = result[key];
                    let author = currentMessage.author;
                    let content = currentMessage.content;
                    messagesTextArea.textContent += `${author}: ${content}\n`;
                }
            }});
    })

    submitButton.addEventListener(('click'), ()=>{
        let message ={
            author: nameInput.value,
            content: messageInput.value,
          }
          fetch(url,  {method: 'POST',
          headers: { 'Content-type': 'application/json' }, 
          body: JSON.stringify(message),})
          .then(()=>{
              nameInput.value = '';
              messageInput.value = '';
          })
          
    })

    
}

attachEvents();