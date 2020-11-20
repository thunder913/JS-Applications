const baseUrl = `https://shoeshelf-ffe3a.firebaseio.com`;
const router = Sammy('main', function(){

    this.use('Handlebars', 'hbs');

    this.get('/home', async function(context){
        let shoes = await fetch(`${baseUrl}/shoes/.json`)
                        .then((data) => data.json());
        
        context.anyShoes = !!shoes;
        if (shoes) {
            let keys = Object.keys(shoes);
            for (const key of keys) {
                shoes[key] = {...shoes[key], ...{shoeId: key}};
            }
            shoes = Object.values(shoes);
            shoes.sort((a,b)=> compare(a,b))
            context.shoes = shoes;
        }
        loadPartials(this)
            .then(function(){  
                this.loadPartials({shoes: '../templates/shoes.hbs'})
                    .then(function(){
                this.partial('../templates/home.hbs');
            })})
    })

    this.get('/create', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/createOffer.hbs')
            })
    })

    this.get('/register', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        let {email, password, repeatPassword} = context.params;
        if (email !== '' && password.length >= 6 && password === repeatPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((res)=> {
                    localStorage.setItem('user' , JSON.stringify({email, uid: res.user.uid}))
                    this.redirect('/home')})
                .catch(()=>{
                    alert('There has been an error. This account might be existing.');
                });
        }else{
            alert('All inputs must be filled and the passwords must match!');
        }
    })

    this.get('/login', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        let {email, password} = context.params;
        firebase.auth().signInWithEmailAndPassword(email,password) 
            .then((data) => {
                localStorage.setItem('user' , JSON.stringify({email, uid: data.user.uid}))
                this.redirect('/home');
            }).catch(()=> alert('Invalid email or password!'));
    })

    this.get('/logout', function(){
        firebase.auth().signOut();
        localStorage.clear();
        this.redirect('/home');
    })

    this.post('/create', function(context){
        let {name, price, url, description, brand} = context.params;
        let creator = JSON.parse(localStorage.getItem('user')).email;
        if (name !== '' && price !== '' && url !== '' && description !== '' && brand !== '') {
            fetch(`${baseUrl}/shoes/.json`, {method: 'POST', body:JSON.stringify({name, price, url, description, brand, creator, boughtBy: []})})
                .then(()=> this.redirect('/home'));            
        }else{
            alert('All inputs must be filled!');
        }
    })

    this.get('/details/:id',async function(context){
        let id = context.params.id;
        let currentShoe = await fetch(`${baseUrl}/shoes/${id}.json`)
            .then((data)=> data.json());
        
        let {name, url, description, price, creator, boughtBy} = currentShoe;
        setDetailsInContext(context, name, url, description, price, id);
        if (boughtBy) {
            this.buyersCount = boughtBy.length ? boughtBy.length : 0;
        }else{
            this.buyersCount = 0;
        }
        let userEmail = JSON.parse(localStorage.getItem('user')).email;
        if (boughtBy && boughtBy.includes(userEmail)) {
            this.hasBough = true;
        }
        if (creator === userEmail) {
            this.isCreator = true;
        }
        loadPartials(this)
            .then(function(){
                        this.partial('../templates/offer-details.hbs');
                    })
            })
        
    this.get('/edit/:id', async function(context){
        let id = context.params.id;
        let currentShoe = await fetch(`${baseUrl}/shoes/${id}.json`)
            .then((data)=> data.json());
            let {name, url, description, price, brand} = currentShoe;
            setDetailsInContext(context, name, url, description, price, id, brand);

            loadPartials(this)
                .then(function(){
                    this.partial('../templates/edit-offer.hbs');
                })
        })
       
    this.post('/edit/:id', function(context){
        let {name, price, url, description, brand, id} = context.params;
        fetch(`${baseUrl}/shoes/${id}.json`, {method: 'PATCH', body: JSON.stringify({name, price, url, description, brand})})
            .then(function(){
                context.redirect(`/details/${id}`);
            })
    })

    this.get('/delete/:id', function(context){
        let id = context.params.id;
        fetch(`${baseUrl}/shoes/${id}.json`, {method: 'delete'})
            .then(function(){
                context.redirect('/home');
            })
    })

    this.get('/buy/:id', async function(context){
        let id = context.params.id;
        let currentShoe = await fetch(`${baseUrl}/shoes/${id}.json`)
                                            .then(data => data.json());
        let boughtBy = currentShoe.boughtBy ? currentShoe.boughtBy : [];

        let email = JSON.parse(localStorage.getItem('user')).email;
        boughtBy.push(email);

        fetch(`${baseUrl}/shoes/${id}.json`, {method: 'PATCH', body: JSON.stringify({boughtBy})})
            .then(()=> context.redirect(`/details/${id}`));
    })
})


router.run('/home');

function isLoggedIn(context){
    let userStorage = JSON.parse(localStorage.getItem('user'));
    if (userStorage && userStorage.email && userStorage.uid) {
        context.email = userStorage.email;
        context.loggedIn = true;
    }
}

function loadPartials(context){
    isLoggedIn(context);
    return context.loadPartials({header: '../templates/header.hbs', footer: '../templates/footer.hbs'});
}

function setDetailsInContext(context, name, url, description, price, id, brand){
    context.name = name;
    context.url = url;
    context.description = description;
    context.price = price;
    context.id = id;
    context.brand = brand;
}

function compare(a,b){
    let aBoughtCount = a.boughtBy ? a.boughtBy.length : 0;
    let bBoughtCount = b.boughtBy ? b.boughtBy.length : 0;

    if (aBoughtCount < bBoughtCount) {
        return 1;
    }else if (aBoughtCount > bBoughtCount) {
        return -1;
    }
    return 0;
}