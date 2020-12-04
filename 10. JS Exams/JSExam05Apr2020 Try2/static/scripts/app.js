const notifications = document.querySelectorAll('.notifications');
const errorBox = notifications[0];
const successBox = notifications[1];
const baseUrl = `https://moviesexam-94e18-default-rtdb.firebaseio.com/movies/`;
successBox.style.display = 'none';
errorBox.style.display = 'none';

let searchKEy;
localStorage.removeItem('user');
const router = Sammy('main', function(){
    this.use('Handlebars', 'hbs');

    this.get('/home',async function(context){
        let searchKey = context.params.search;
        if(getUserData()){
            const movies = await fetch(`${baseUrl}.json`).then(res=> res.json());
            if (movies) {
                let keys = Object.keys(movies);
                let moviesArr = [];
                for (const key of keys) {
                    const {title, imageUrl} = movies[key];
                    if (searchKey) {
                        let contains = title.toLowerCase().includes(searchKey.toLowerCase());
                        if (contains) {
                            moviesArr.push({title, imageUrl, id: key});
                        }
                    }else{
                    moviesArr.push({title, imageUrl, id: key});
                    }
                }
                context.movies = moviesArr;
            }
        }
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/home.hbs');
            })
    })

    this.get('/register', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        const {email, password, repeatPassword} = context.params;
        if (!email) {
            showRedNotification('All the inputs must be filled!')
        }else if(password.length<6){
            showRedNotification('The password must be at least 6 characters long!');
        }else if(password !== repeatPassword){
            showRedNotification('The passwords must match!');
        }else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(data){
                    showGreenNotification('Successfully registered!');
                    saveUserData(email, data.user.uid);
                    context.redirect('/home');
                })
                .catch(()=>{
                    showRedNotification('The email is already registered!');
                })
        }
    })

    this.get('/login', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        const {email, password} = context.params;

        firebase.auth().signInWithEmailAndPassword(email, password) 
            .then(function(data){
                showGreenNotification('Logged in successfully');
                saveUserData(email, data.user.uid);
                context.redirect('/home');
            })
            .catch(()=>{
                showRedNotification('Invalid email or password!');
            })
    })

    this.get('/logout', function(){
        showGreenNotification('Successfull logout');
        localStorage.removeItem('user');
        firebase.auth().signOut();
        this.redirect('/home');
    })

    this.get('/add-movie', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/add-movie.hbs');
            })
    })

    this.post('/add-movie', function(context){
        const {title, description, imageUrl} = context.params;
        if (!title || !description || !imageUrl) {
            showRedNotification('Invalid inputs!');
        }else{
            fetch(`${baseUrl}.json`, {method: 'POST', body: JSON.stringify({title, description, imageUrl, creator: getUserData().email})})
                .then(function(){
                    showGreenNotification('Creted successfully');
                    context.redirect('/home');
                })
                .catch(()=>{
                    showRedNotification('Something went wrong, try again!');
                })

        }
    })

    this.get('/details/:id',async function(context){
        const id = context.params.id;
        hasUserLiked(id, context);
        const movie = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        let {title, description ,imageUrl, liked, creator} = movie;
        liked = liked ? liked.length : 0;
        const currentUser = getUserData()
        if (creator === currentUser.email) {
            context.creator = creator;
        }

        context.title = title;
        context.imageUrl = imageUrl;
        context.description = description;
        context.liked = liked;
        context.id = id;

        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/details.hbs');
            })

    })

    this.get('/edit/:id', async function(context){
        const id = context.params.id;
        const movie = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());

        const {title, description, imageUrl} = movie;
        context.title = title;
        context.description = description;
        context.imageUrl = imageUrl;
        context.id = id;
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/edit.hbs');
            })
    })

    this.post('/edit/:id', function(context){
        const {title, description, imageUrl, id} = context.params;

        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body: JSON.stringify({title,description,imageUrl})})
            .then(function(){
                showGreenNotification('Edited successfully');
                context.redirect(`/details/${id}`);
            })
            .catch(()=>{
                showRedNotification('Something went wrong, try again...');
            })
    })

    this.get('/like/:id',async function(context){
        const id = context.params.id;
        let movie = await fetch(`${baseUrl}${id}.json`);
        let liked = movie.liked ? movie.liked : [];
        const userEmail = getUserData().email;
        if (!liked.includes(userEmail)) {
            liked.push(userEmail);
        }
        fetch(`${baseUrl}${id}.json`, {method: 'PATCH', body: JSON.stringify({liked})})
            .then(()=>{
                context.redirect(`/details/${id}`);
            })
    })

    this.get('/delete/:id', function(context){
        const id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})    
            .then(function(){
                showGreenNotification('Deleted successfully');
                context.redirect('/home');
            })
    })

})

router.run('/home');


function loadPartials(context){
    let user = getUserData();
    if(user){
        context.email = user.email;
    }
    return context.loadPartials({header: '../static/templates/header.hbs'});
}

function saveUserData(email, uid){
    localStorage.setItem('user', JSON.stringify({email,uid}));
}

function getUserData(){
    return JSON.parse(localStorage.getItem('user'));
}

async function hasUserLiked(id, context){
    let movie = await fetch(`${baseUrl}${id}.json`);
    let liked = movie.liked ? movie.liked : [];
    let currentUserEmail = getUserData().email;
    if (liked.includes(currentUserEmail)) {
        context.liked = true;
    }
}

function showGreenNotification(message){
    successBox.textContent = message;
        successBox.style.display = 'block';
    setTimeout(() => {
        successBox.style.display = 'none';
    }, 1000);
}

function showRedNotification(message){
    errorBox.textContent = message;
        errorBox.style.display = 'block';
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 1000);
}