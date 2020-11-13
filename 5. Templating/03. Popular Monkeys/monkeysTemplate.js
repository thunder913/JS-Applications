$(() => {
    let srcTemplate = document.querySelector('#monkey-template').innerHTML;
    let template = Handlebars.compile(srcTemplate);
    let monkeysDiv = document.querySelector('.monkeys');
    let html = template({monkeys});
    monkeysDiv.innerHTML = html;

    let infoButtons = document.querySelectorAll('#info');
    for (const button of infoButtons) {
        button.addEventListener('click', (e)=>{
            let target = e.target;
            let pElement = target.parentElement.querySelector('p');
            pElement.style.display = pElement.style.display === 'none' ? 'block' : 'none'; 
        })
    }
})