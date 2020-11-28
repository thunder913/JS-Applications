const baseUrl = 'https://examsdb-c5b5c.firebaseio.com/posts/';
firebase.auth().signOut;
localStorage.removeItem('user');

const router = Sammy('main', function(){

    this.use('Handlebars', 'hbs');

    this.get('/home',async function(context){

        let posts = await fetch(`${baseUrl}.json`).then(data=> data.json());
        let user = JSON.parse(localStorage.getItem('user'));
        loadPartials(context)
            .then(function(){
                if (posts && user) {
                    let postArr = [];
                    let keys = Object.keys(posts);
                    for (const key of keys) {
                        let {creator, title, category, content} = posts[key];
                        if (creator === JSON.parse(localStorage.getItem('user')).email) {
                            postArr.push({title, category, content, uid: key});
                        }
                    }
                    context.posts = postArr;
                }
                this.partial('../templates/home.hbs');
            })
    })

    this.get('/login', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/login.hbs');
            })
    })

    this.post('/login', function(context){
        const {email, password} = context.params;
        if (email === '' || password === '') {
            alert('Fill all the fields!');           
        }else{
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(data){
                    localStorage.setItem('user', JSON.stringify({email, uid: data.user.uid}));
                    context.redirect('/home');
                })
                .catch(err=>{
                    alert('Invalid email or password!');
                    console.log(err);
                })
        }
    })

    this.get('/register', function(){
        loadPartials(this)
            .then(function(){
                this.partial('../templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        const {email, password, repeatPassword} = context.params;

        if (password !== repeatPassword || password === '' || email === '') {
            alert('Passwords do not match!');
        }else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(data){
                    localStorage.setItem('user', JSON.stringify({email, uid: data.user.uid}));
                    context.redirect('/home');
                })
                .catch(err=> console.log(err))
        }})

    this.get('/logout', function(){
        localStorage.clear();
        this.redirect('/home');
    })

    this.get('/', function(){
        this.redirect('/home');
    })

    this.post('/create-post',function(context){
        let {title, category, content} = context.params;
        let email = JSON.parse(localStorage.getItem('user')).email;
        fetch(`${baseUrl}.json`, {method:'POST', body: JSON.stringify({title, category,content, creator: email})})
            .then(function(){
                context.redirect('/home');
            })
    })

    this.get('/delete/:id', function(context){
        let id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method: 'DELETE'})
            .then(function(){
                context.redirect('/home');
            })
    })

    this.get('/details/:id',async function(context){
        let id = context.params.id;
        let post = await fetch(`${baseUrl}${id}.json`)
                .then(data => data.json());
        let {title, category, content} = post;
        context.title = title;
        context.category = category;
        context.content = content;
        loadPartials(context)  
                .then(function(){
                    this.partial('../templates/details.hbs');
                })
    })

    this.get('/edit/:id', async function(context){
        let id = context.params.id;
        let posts = await fetch(`${baseUrl}.json`).then(data=> data.json());
            await setEditDetails(context, id);
            context.editing = true;
        loadPartials(context)
            .then(function(){
                if (posts) {
                    let postArr = [];
                    let keys = Object.keys(posts);
                    for (const key of keys) {
                        let {creator, title, category, content} = posts[key];
                        if (creator === JSON.parse(localStorage.getItem('user')).email) {
                            postArr.push({title, category, content, uid: key});
                        }
                    }
                    context.posts = postArr;
                }
                this.partial('../templates/home.hbs');
            })
    })

    this.post('/edit/:id',function(context){
        let {title, content, category, id} = context.params;
        fetch(`${baseUrl}${id}.json`, {method: 'PATCH', body: JSON.stringify({title, content, category})})
            .then(function(){
                context.redirect('/home')
            })
            .catch(err=> console.log(err));
    })
})

router.run('/home');

async function setEditDetails(context, editId){
        let post = await fetch(`${baseUrl}${editId}.json`)
                .then(data => data.json());
        let {title, category, content} = post;
        context.uid = editId;
        context.title = title;
        context.category = category;
        context.content = content;
}

function loadPartials(context){
    let getUser = localStorage.getItem('user');
    let user = getUser ? JSON.parse(getUser) : false;
    if (user) {
        context.logged = true;
        context.email = user.email;
    }
    return context.loadPartials({header: '../templates/header.hbs'});
}

