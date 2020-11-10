let baseUrl = `https://students-project-2c61e.firebaseio.com/`;

let idInput = document.querySelector('#id');
let firstNameInput = document.querySelector('#firstName');
let lastNameInput = document.querySelector('#lastName');
let facultyNumberInput = document.querySelector('#facultyNumber');
let gradeInput = document.querySelector('#grade');
let submitButton = document.querySelector('#submit');
let loadButton = document.querySelector('#load');
let tbody = document.querySelector('tbody');

submitButton.addEventListener('click', (e)=>{
    e.preventDefault();
    if (isNaN(Number(idInput.value)) || idInput.value === '') {
        alert('The ID must be a number and not empty!');
        return;
    }else if (typeof firstNameInput.value !== 'string' || firstNameInput.value === '') {
        alert('The first name must be a string and not empty!');
        return;
    }else if (typeof lastNameInput.value !== 'string' || lastNameInput.value === '') {
        alert('The last name must be a string and not empty!');
        return;
    }else if (isNaN(Number(gradeInput.value)) || gradeInput.value === '') {
        alert('The grade must be a number and not empty!');
        return;
    }else if (isNaN(Number(facultyNumberInput.value)) || facultyNumberInput === '') {
        alert('The faculty number must a number and not empty!');
        return;
    }

    let objectToAdd = {id: idInput.value, firstName: firstNameInput.value, lastName: lastNameInput.value, grade: gradeInput.value, facultyNumber: facultyNumberInput.value};
    fetch(`${baseUrl}/students/.json`, {method: 'POST', body: JSON.stringify(objectToAdd)})
        .then(response => response.json())
        .then(key => loadStudents(e));
});

loadButton.addEventListener('click',async (e)=> loadStudents(e));

async function loadStudents(e){
    e.preventDefault();
    let students = await getStudentsData();
    if (students === null) {
        return;
    }
    tbody.innerHTML = '';
    let keys = Object.keys(students);
    for (const key of keys) {
        addStudentToTBody(key, students[key]);
    }

    let tableRows = Array.from(document.querySelectorAll('tbody tr'));
    tableRows = tableRows.sort((a,b) => compare(a,b));

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (const row of tableRows) {
        tbody.appendChild(row);
    }
}

function compare(a,b){
    let aId = a.querySelector('td').textContent;
    let bId = b.querySelector('td').textContent;
    if (aId>bId) {
        return 1;
    }else if (aId<bId) {
        return -1
    }
    return 0;
}

function addStudentToTBody(key, currObj){
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${currObj.id}</td>
    <td>${currObj.firstName}</td>
    <td>${currObj.lastName}</td>
    <td>${currObj.facultyNumber}</td>
    <td>${currObj.grade}</td>`;
    tr.setAttribute('data-id', key);
    tbody.appendChild(tr);
}

async function getStudentsData(){
    return fetch(`${baseUrl}/students/.json`)
        .then(response => response.json());

}
