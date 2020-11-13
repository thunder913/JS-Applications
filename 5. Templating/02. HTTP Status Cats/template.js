(() => {
     renderCatTemplate();

     function renderCatTemplate() {
         let catsUL = document.querySelector('#allCats ul');
         let src = document.querySelector("#cat-template").innerHTML;
         let template = Handlebars.compile(src);
        let html = template({cats});
        catsUL.innerHTML = html;

        let buttons = document.querySelectorAll('.showBtn');
        for (const button of buttons) {
            button.addEventListener('click', (e)=>{
                let target = e.target;
                let divElement = target.parentElement.querySelector('.status');
                if (target.innerText === 'Show status code') {
                    target.innerText = 'Hide status code';
                    divElement.style.display = 'block';
                }else{
                    target.innerText = 'Show status code';
                    divElement.style.display = 'none';
                }
            })
        }
     }
})();
