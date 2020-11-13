let loadButton = document.querySelector('#btnLoadTowns');
let townsUL = document.querySelector('#root ul');
let srcTemplate = document.querySelector('#towns-template').innerHTML;
let townInput = document.querySelector('#towns');
let template = Handlebars.compile(srcTemplate);
loadButton.addEventListener('click', ()=>{
    townsUL.innerHTML = '';
    let allTowns = townInput.value.split(', ');
    let html = template({towns: allTowns});
    townsUL.innerHTML = html;
})
