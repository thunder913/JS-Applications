const baseUrl = `https://examsdb-c5b5c.firebaseio.com/shoeshelf/`;
const router = Sammy('main', function(){

    this.use('Handlebars', 'hbs');

    this.get('/home',async function(context){
        const shoes = await fetch(`${baseUrl}.json`).then(data=> data.json());
        loadPartials(context)
            .then(function(){
                if (context.logged) {
                    if (shoes) {
                        let keys = Object.keys(shoes);
                        let shoeArr = [];
                        for (const key of keys) {
                            let {name, imageUrl, price, bought} = shoes[key];
                            bought = bought ? bought : [];
                            shoeArr.push({name, imageUrl, price, id: key, bought});
                        }
                        shoeArr = shoeArr.sort((a,b)=> compare(a,b));
                        context.shoes = shoeArr;
                    }
                }
                this.partial("../templates/home.hbs");
            })
    })

    this.get('/register', function(){
        loadPartials(this)
            .then(function(){
                this.partial("../templates/register.hbs");
            })
    })

    this.post('/register', function(context){
        const {email, password, repeatPassword} = context.params;
        if (email && password.length >= 6 && password === repeatPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(data=>{
                    saveUserData(email, data.user.uid);
                    context.redirect('/home');
                })
                .catch(err=>{
                    console.log(err);
                })
            }
    })

    this.get('/login', function(){
        loadPartials(this)  
            .then(function(){
                this.partial('../templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        const {email, password} = context.params;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(data =>{
                saveUserData(email, data.user.uid);
                context.redirect('/home');
            })
            .catch(err=>{
                console.log(err);
            })
    })

    this.get('/logout', function(){
        localStorage.removeItem('user');
        firebase.auth().signOut();
        this.redirect('/home');
    })

    this.get('/create-offer', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/create-offer.hbs');
            })
    })

    this.post('/create-offer', function(context){
        const {name, price, imageUrl, description, brand} = context.params;
        if (name && price && imageUrl && description && brand) {
            const creator = getUserData().email;
            fetch(`${baseUrl}.json`, {method:'POST', body: JSON.stringify({name,price,imageUrl, description, brand, creator})})
                .then(()=>{
                    context.redirect('/home');
                })
        }
    })

    this.get('/details/:id',async function(context){
        const id = context.params.id;
        const shoe = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        const currentEmail = getUserData().email;
        context.name = shoe.name;
        context.description = shoe.description;
        context.buyers = shoe.buyers ? shoe.buyers : 0;
        context.price = shoe.price;
        context.imageUrl = shoe.imageUrl;
        let bought = shoe.bought ? shoe.bought : [];
        context.buyers = bought.length;
        if (bought.includes(currentEmail)) {
            context.bought = true;
        }
        if (currentEmail === shoe.creator) {
            context.creator = true;
        }
        context.id = id;
        loadPartials(context)
            .then(function(){
                this.partial('../templates/details.hbs');
            })
    })

    this.get('/edit/:id', async function(context){
        const id = context.params.id;
        const shoe = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        context.name = shoe.name;
        context.price = shoe.price;
        context.imageUrl = shoe.imageUrl;
        context.description = shoe.description;
        context.brand = shoe.brand;
        context.id = id;

        loadPartials(context)
            .then(function(){
                this.partial('../templates/edit-offer.hbs');
            })
    
    })

    this.post('/edit/:id', function(context){
        const {name, price, imageUrl, description, brand, id} = context.params;
        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body: JSON.stringify({name,price,imageUrl, description, brand})})
                .then(function(){
                    context.redirect(`/details/${id}`);
                })
    })

    this.get('/buy/:id',async function(context){
        const id = context.params.id;
        let shoe = await fetch(`${baseUrl}${id}.json`).then(data=>data.json());
        let bought = shoe.bought ? shoe.bought : [];
        bought.push(getUserData().email);
        shoe.bought = bought;
        fetch(`${baseUrl}${id}.json`, {method: 'PATCH', body: JSON.stringify(shoe)})
            .then(function(){
                context.redirect(`/details/${id}`);
            })
    })

    this.get('/delete/:id', function(context){
        const id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})
            .then(function(){
                context.redirect('/home');
            })
    })
})

router.run('/home');

function loadPartials(context){
    const user = getUserData();
    if (user) {
        context.logged = true;
        context.email = user.email;
    }
    return context.loadPartials({'header': "../templates/header.hbs"});
}

function saveUserData(email, uid){
    localStorage.setItem('user', JSON.stringify({email, uid}));
}

function getUserData(){
    return JSON.parse(localStorage.getItem('user'));
}

function compare(a,b){
    return b.bought.length - a.bought.length;
}