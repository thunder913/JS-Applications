localStorage.removeItem('user');
const loadingDiv = document.querySelector('#loadingBox');
const successBox = document.querySelector('#successBox');
const errorBox = document.querySelector('#errorBox');
const baseUrl = 'https://examsdb-c5b5c.firebaseio.com/softterest/';
const router = Sammy('main', function(){

    this.use('Handlebars', 'hbs');
    
    this.get('/home',async function(context){
        showLoadingBox();
        let ideas = await fetch(`${baseUrl}.json`).then(data=> data.json());
        loadPartials(context)
            .then(function(){
                if (context.logged) {
                    if (ideas) {
                        let keys = Object.keys(ideas);
                        let ideasArr = [];
                        for (const key of keys) {
                            const {title, imageURL, likes} = ideas[key];
                            ideasArr.push({title, imageURL, id: key, likes});
                        }
                        ideasArr = ideasArr.sort((a,b)=>compare(a,b));
                        context.ideas = ideasArr;
                    }
                }
                hideLoadingBox();
                this.partial('../templates/home.hbs');
            })
    })

    this.get('/register', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                hideLoadingBox();
                this.partial('../templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        const {username, password, repeatPassword} = context.params;
        if (username.length < 3) {
            showRedNotification('Username cannot must be at least 3 symbols!');
        }else if(password.length < 3 || password !== repeatPassword){
            showRedNotification('The passwords must be at least 3 symbols and must match!')
        }else{
            showLoadingBox();
            firebase.auth().createUserWithEmailAndPassword(username,password)
                .then(function(data){
                    hideLoadingBox();
                    showGreenNotification('User registration successful.');
                    setUserDetails(username, data.user.uid);
                    context.redirect('/home');
                })
                .catch(err=>{
                    hideLoadingBox();
                    showRedNotification('This user is already registered!');
                })
                
        }

    })

    this.get('/login', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                hideLoadingBox();
                this.partial('../templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        showLoadingBox();
        const {username, password} = context.params;
        firebase.auth().signInWithEmailAndPassword(username, password)
            .then(function(data){
                hideLoadingBox();
                showGreenNotification('Login successful.');
                setUserDetails(username, data.user.uid);
                context.redirect('/home');
            })
            .catch(err=>{
                hideLoadingBox();
                showRedNotification('Invalid credentials!');
            })
    })

    this.get('/logout', function(){
        showLoadingBox();
        localStorage.removeItem('user');
        firebase.auth().signOut();
        hideLoadingBox();
        showGreenNotification('Logout successful.');
        this.redirect('/home');
    })

    this.get('/create', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                hideLoadingBox();
                this.partial('../templates/create.hbs');
            })
    })

    this.post('/create', function(context){
        showLoadingBox();
        const {title, description, imageURL} = context.params;
        const regexURL = /(^http:\/\/|https:\/\/)/;
        if (title.length < 6 && description.length < 10 && !imageURL.match(regexURL)) {
            showRedNotification('Something went wrong...');
        }else{
            let creator = JSON.parse(localStorage.getItem('user')).email;
            fetch(`${baseUrl}.json`, {method:'POST', body: JSON.stringify({title,description,imageURL, creator,comments: [], likes:0})})
                .then(()=>{
                    hideLoadingBox();
                    showGreenNotification('Idea created successfully!');
                    context.redirect('/home');
                })
        }
    })

    this.get('/details/:id',async function(context) {
        showLoadingBox();
        let id = context.params.id;
        let userEmail = JSON.parse(localStorage.getItem('user')).email;
        let currentIdea = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        const {creator, description, imageURL, likes, title, comments} = currentIdea;
        if (userEmail === creator) {
            context.creator = true;
        }
        context.description = description;
        context.imageURL = imageURL;
        context.likes = likes;
        context.title = title;
        context.comments = comments;
        context.id = id;
        loadPartials(context)
            .then(function(){
                hideLoadingBox();
                this.partial('../templates/details.hbs');
            })
    })

    this.post('/comment/:id',function(context){
        showLoadingBox();
        const {id, newComment} = context.params;
        fetch(`${baseUrl}${id}.json`)
            .then(data=> data.json())
            .then(function(data){
                let {comments} = data;
                comments = comments ? comments : [];
                comments.push({comment: newComment, email: JSON.parse(localStorage.getItem('user')).email});
                fetch(`${baseUrl}${id}.json`, {method:'PATCH', body: JSON.stringify({comments})})
                    .then(function(){
                        hideLoadingBox();
                        context.redirect(`/details/${id}`);
                    })
            });

    })

    this.get('/like/:id', function(context){
        showLoadingBox();
        let id = context.params.id;
        fetch(`${baseUrl}${id}.json`)
            .then(data=> data.json())
            .then(function(comment){
                comment.likes++;
                fetch(`${baseUrl}${id}.json`, {method: 'PATCH', body: JSON.stringify(comment)})
                    .then(function(){
                        hideLoadingBox();
                        context.redirect(`/details/${id}`);
                    })
            })
    })

    this.get('/delete/:id', function(context){
        showLoadingBox();
        let id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})
            .then(function(){
                hideLoadingBox();
                showGreenNotification('Idea deleted successfully.');
                context.redirect('/home');
            })
    })
})

router.run('/home');

function loadPartials(context){
    checkIfLogged(context)
    return context.loadPartials({header: '../templates/header.hbs', footer: '../templates/footer.hbs'});
}

function setUserDetails(email, uid){
    localStorage.setItem('user', JSON.stringify({email,uid}));
}

function checkIfLogged(context){
    let user = localStorage.getItem('user');
    context.logged = user ? true : false; 
}

function compare(a,b){
    return b.likes - a.likes;
}

function showGreenNotification(comment){
    successBox.style.display = 'block'
    successBox.textContent = comment;
    setTimeout(() => {
        successBox.style.display = 'none';
    }, 1500);
}

function showRedNotification(comment){
    errorBox.style.display = 'block'
    errorBox.textContent = comment;
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 1500);
}

function showLoadingBox(){
    loadingDiv.style.display = 'block';
}

function hideLoadingBox(){
    loadingDiv.style.display = 'none';
}