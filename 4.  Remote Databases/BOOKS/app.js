    let baseUrl = 'https://books-41a52.firebaseio.com';

    let loadBooksButton = document.querySelector('#loadBooks');
    let booksTbody = document.querySelector('tbody');
    let submitButton = document.querySelector('form button');
    let titleInput = document.querySelector('#title');
    let authorInput = document.querySelector('#author');
    let isbn = document.querySelector('#isbn');

    submitButton.addEventListener('click', (e)=> onSubmitButtonClick(e));
    loadBooksButton.addEventListener('click', ()=> onLoadBooksButtonClick())

    function onSubmitButtonClick(e){
        e.preventDefault();
        if (titleInput.value !== '' && authorInput.value !== '' && isbn.value !== '') {
            let newBook = {title: titleInput.value, author: authorInput.value, isbn: isbn.value};
            fetch(`${baseUrl}/books/.json`, {method: 'POST', body:JSON.stringify(newBook)})
                .then(response => response.json())
                .then(key => addBookToTBody(key.name, newBook));
        }else{
            alert('You must fill all the input fields!');
        }
    }

    async function onLoadBooksButtonClick(){
        let books = await getBooksData();
        booksTbody.innerHTML = '';
        if (!books) {
            return;
        }
        let keys = Object.keys(books);
        for (const key of keys) {
            let currObject = books[key];
            addBookToTBody(key, currObject);
        }
    }

    async function onDeleteButtonClick(e){
        let itemToRemove = e.target.parentElement.parentElement;
        let id = itemToRemove.dataset.id;
        await fetch(`${baseUrl}/books/${id}.json`, {method: 'DELETE'})
            .then(()=> {itemToRemove.remove()});
    }

    function onEditButtonClick(e){
        let form = document.querySelector('#edit');
        if (form) {
            form.remove();
        }
        let tr = e.target.parentElement.parentElement;
        let key = tr.dataset.id;
        let allDataInElement = tr.querySelectorAll('td');
        let currTitle = allDataInElement[0].innerText;
        let currAuthor = allDataInElement[1].innerText;
        let currIsbn = allDataInElement[2].innerText;
        let editForm = document.createElement('form');
        editForm.innerHTML = `<h3>Edit book</h3>
            <label>TITLE</label>
            <input type="title" id="title" value="${currTitle}">
            <label>AUTHOR</label>
            <input type="title" id="author" value="${currAuthor}">
            <label>ISBN</label>
            <input type="title" id="isbn" value="${currIsbn}">
            <button>Change</button>`
        editForm.setAttribute('id', 'edit')
        document.body.appendChild(editForm);
        let changeButton = editForm.querySelector('button');
        changeButton.addEventListener('click', (e)=> onChangeButtonClick(key, tr, e));
    }

    function onChangeButtonClick(key, tr ,e){
        let currentForm = e.target.parentElement;
        let title = currentForm.querySelector('#title').value;
        let author = currentForm.querySelector('#author').value;
        let isbn = currentForm.querySelector('#isbn').value;
        let newObj = {title, author, isbn};
        fetch(`${baseUrl}/books/${key}.json`, {method: 'PATCH', body: JSON.stringify(newObj)});
        let tds = tr.querySelectorAll('td');
        tds[0].innerText = title;
        tds[1].innerText = author;
        tds[2].innerText = isbn;
        document.body.removeChild(currentForm);
    }

    function addBookToTBody(key, currObject){
        let tr = document.createElement('tr');
        tr.setAttribute('data-id', key);
        let titleTd = document.createElement('td');
        titleTd.innerText = currObject.title;
        let authorTd = document.createElement('td');
        authorTd.innerText = currObject.author;
        let isbnTd = document.createElement('td');
        isbnTd.innerText = currObject.isbn;
        let actionTd = document.createElement('td');
        
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';

        actionTd.appendChild(editButton);
        actionTd.appendChild(deleteButton);
        
        tr.appendChild(titleTd);
        tr.appendChild(authorTd);
        tr.appendChild(isbnTd);
        tr.appendChild(actionTd);

        deleteButton.addEventListener('click', (e)=>onDeleteButtonClick(e));
        editButton.addEventListener('click', (e)=> onEditButtonClick(e));
        booksTbody.appendChild(tr);

        titleInput.value = '';
        authorInput.value = '';
        isbn.value = '';
        
    }


    async function getBooksData(){
        return fetch(`${baseUrl}/books/.json`)
            .then(response => response.json())
    }