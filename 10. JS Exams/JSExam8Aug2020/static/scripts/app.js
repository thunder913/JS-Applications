const baseUrl = `https://examsdb-c5b5c.firebaseio.com/movies/`;
let successNotification = document.querySelector('#successBox');
let errorNotification = document.querySelector('#errorBox');
const router = Sammy('main', function(){
    this.use('Handlebars', 'hbs');

    this.get('/home',async function(context){
        let movies = await fetch(`${baseUrl}.json`).then((data)=> data.json());
        let searchKey = context.params.search;
        loadPartials(context)
            .then(function(){
                if (context.loggedIn) {
                    if (movies) {
                        let moviesArr = [];
                        let keys = Object.keys(movies);
                        for (const key of keys) {
                            let uid = key;
                            let title = movies[key].title;
                            let image = movies[key].image;
                            if (searchKey) {
                                let contains = title.toLowerCase().includes(searchKey.toLowerCase());
                                if (contains) {
                                    moviesArr.push({uid, title, image});
                                }
                            }else{
                            moviesArr.push({uid, title, image});
                            }
                        }
                        context.movies = moviesArr;
                    }
                }
                this.partial('../static/templates/home.hbs');
    })
  })

    this.get('/register', function(context){
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        let {email, password, repeatPassword} = context.params;
        if (email === '' || password.length < 6 || password !== repeatPassword) {
            showError('The email was missing or the password do not match. They must be at least 6 characters!');
        }else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((data) => {
                    localStorage.setItem('user', JSON.stringify({email, uid: data.user.uid}));
                    showSuccess('You have successfully registered!');
                    this.redirect('/home');
                    })
                .catch((err)=>{
                    showError('Email is already in use!');
                })
    }})

    this.get('/login', function(context){
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        let {email, password} = context.params;
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then((data) => {
                showSuccess('Login successful');
                localStorage.setItem('user', JSON.stringify({email, uid: data.user.uid}));
                this.redirect('/home');
            })
            .catch(err =>{
                showError('Invalid email or password');
            })
    })

    this.get('/logout', function(){
        localStorage.removeItem('user');
        showSuccess('You have successfully logged out!');
        this.redirect('/home');
    })

    this.get('/addmovie', function(context){
        loadPartials(context)
            .then(()=>{
                context.partial('../static/templates/add-movie.hbs');
            })
    })

    this.post('/addmovie', function(context){
        let {title, description, imageUrl} = context.params;
        if (!title || !description || !imageUrl) {
            showError('Invalid inputs!');
        }else{
        let creatorEmail = JSON.parse(localStorage.getItem('user')).email;
        fetch(`${baseUrl}.json`, {method:'post', body: JSON.stringify({creator: creatorEmail, title, description, image: imageUrl, liked: []})})
            .then(()=>{
                showSuccess('Movie has been added successfully!');
                context.redirect('/home');
            })}
    })
    this.get('/details/:id', async function(context){
        await setContext(context)
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/movie-details.hbs');
            })
    })

    this.get('/edit/:id',async function(context){
        await setContext(context);
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/edit.hbs');
            })
    })

    this.post('edit/:id', function(context){
        let {id, title, description, imageUrl} = context.params;
        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body: JSON.stringify({title, description, image: imageUrl})})
            .then(function(){
                showSuccess('Edited successfully');
                context.redirect(`/details/${id}`);
            })
    })

    this.get('/delete/:id', function(context){
        let id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})
            .then(function(){
                showSuccess('Deleted successfully');
                context.redirect('/home');
            })
    })

    this.get('/like/:id',async function(context){
        let id = context.params.id;
        let email = (JSON.parse(localStorage.getItem('user'))).email;
        let movie = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        let currentLiked = movie.liked ? movie.liked : [];
        currentLiked.push(email);
        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body:JSON.stringify({liked: currentLiked})})
                .then(()=> {
                    showSuccess('Liked successfully!');
                    context.redirect(`/details/${id}`);
                })
    })

    this.post('/home?search=:name', function(){
        let name = context.params.name;
        console.log(name);
        this.redirect('/home');
    })
})


router.run('/home');

async function setContext(context){
    let id = context.params.id;
    let {creator, description, image, title, liked} = await fetch(`${baseUrl}/${id}.json`).then(data=> data.json());
    context.uid = id;
    context.title = title;
    context.description = description;
    context.image = image;
    let email = JSON.parse(localStorage.getItem('user')).email;
    if (liked && liked.includes(email)) {
        context.liked = true;
        context.likedCount = liked.length;
    }
    if (creator === JSON.parse(localStorage.getItem('user')).email) {
        context.isCreator = true;
    }
}

function loadPartials(context){
    let getUser = localStorage.getItem('user');
    let user = getUser ? JSON.parse(getUser) : false;
    if (user) {
        context.loggedIn = true;
        context.email = user.email;
    }
    return context.loadPartials({header: '../static/templates/header.hbs', footer: '../static/templates/footer.hbs'});
}

function showError(message){
    errorNotification.parentElement.style.display = 'block';
    errorNotification.style.display = 'block';
    errorNotification.textContent = message;
    setTimeout(() => {
        errorNotification.parentElement.style.display = 'none';
        errorNotification.style.display = 'none';
    }, 2500);
}

function showSuccess(message){
    successNotification.parentElement.style.display = 'block';
    successNotification.style.display = 'block';
    successNotification.textContent = message;
    setTimeout(() => {
        successNotification.parentElement.style.display = 'none';
        successNotification.style.display = 'none';
    }, 2500);
}

