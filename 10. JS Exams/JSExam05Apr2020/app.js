let baseUrl = `https://examsdb-c5b5c.firebaseio.com/softwiki/`;
localStorage.removeItem('user');

const router = Sammy('#root', function(){
    this.use('Handlebars', 'hbs');

    this.get('/home', function(context){
        loadPartials(context, {article: '../templates/article.hbs'})
            .then(function(){
                if (!context.logged) {
                    context.redirect('/login');
                    return;
                }
                fetch(`${baseUrl}.json`)
                        .then(res=> res.json())
                        .then(articles=>{
                            if (articles) {
                                let types = {JavaScript: {articles: [], type: 'JavaScript'}, Python: {articles: [], type: 'Python'}, 'C#': {articles: [], type: 'C#'}, Java: {articles: [], type: 'Java'}};
                                let keys = Object.keys(articles);
                                for (const key of keys) {
                                    let {category, content, title} = articles[key];
                                    category = category === 'CSharp' ? 'C#' : category;
                                    if (!types[category]) {
                                        Object.assign(types, {[category]: {articles: [], type: category}});
                                    }
                                    types[category].articles.push({content,title, uid:key});
                                }
                                keys = Object.keys(types);
                                for (const key of keys) {
                                    let {articles} = types[key]
                                    let sortedArticles = articles.sort((a,b)=> compare(a,b));
                                    types[key].articles = sortedArticles;
                                }
                                context.types = types;
                            }
                            this.partial('../templates/home.hbs');
                        })
                })
            })

    this.get('/login', function(context){
        loadPartials(context)
            .then(function(){
                this.partial('../templates/login.hbs');
            })
    })

    this.get('/register', function(context){
        loadPartials(context)
            .then(function(){
                this.partial('../templates/register.hbs');
            })
    })

    this.post('/register', function(context){
        let {email, password, reppass} = context.params; 
        if (password === reppass) {
            firebase.auth().createUserWithEmailAndPassword(email, password) 
                .then((res)=>{
                    localStorage.setItem('user', JSON.stringify({email, uid: res.user.uid}));
                    this.redirect('/home');
                })
                .catch(function(err){
                    alert('There was an error creating your account. Make sure you have entered matching passwords and try again!');
                })
            }
    })

    this.post('/login', function(context){
    let {email, password} = context.params; 
        firebase.auth().signInWithEmailAndPassword(email, password) 
            .then((res)=>{
                localStorage.setItem('user', JSON.stringify({email, uid: res.user.uid}));
                this.redirect('/home');
            })
            .catch(function(err){
                alert('There was an error logging into your account. Make sure you have entered the right password and email!');
            })
    })

    this.get('/logout', function(){
        localStorage.removeItem('user');
        firebase.auth().signOut();
        this.redirect('/home');
    })
    
    this.get('/create', function(context){
        loadPartials(context)
            .then(function(){
                this.partial('../templates/create.hbs');
            })
    })

    this.post('/create', function(context){
        let {title, category, content} = context.params;
        category = category==='C#' ? 'CSharp' : category; 
        if (!title || !category || !content) {
            alert('All fields must be filled!');
            return;
        }
        if (!['JavaScript', 'CSharp', 'Python', 'Java'].includes(category)){
            alert('The category must be one of the following: JavaScript, C#, Python, Java');
        }
        let email = JSON.parse(localStorage.getItem('user')).email;
        fetch(`${baseUrl}.json`, 
                {method: 'POST', body:JSON.stringify({title,category,content,email})
        }).then(()=> this.redirect('/home'))
        this.redirect('/home');
    })

    this.get('details/:id', function(context){
        let {id} = context.params;
        fetch(`${baseUrl}${id}.json`)
            .then(res => res.json())
            .then(data=>{
                let {title, category, content, email} = data;
                let userEmail = JSON.parse(localStorage.getItem('user')).email;
                if (userEmail === email) {
                    context.creator = true;
                }
                context.title = title;
                context.category = category;
                context.content = content;
                context.id = id;
                loadPartials(context).then(function(){
                this.partial('../templates/details.hbs');
                })
            })
    })

    this.get('/edit/:id', function(context){
        let {id} = context.params;
        fetch(`${baseUrl}${id}.json`)
            .then(res=> res.json())
            .then(data=>{
                let {title, category, content} = data;
                context.title = title;
                context.category = category;
                context.content = content;
                context.id = id;
                loadPartials(context)
                    .then(function(){
                        this.partial('../templates/edit.hbs');
                    })
            })
    })

    this.post('/edit/:id', function(context){
        let {title, category, content, id} = context.params;
        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body:JSON.stringify({title,category,content})})
            .then(function(){
                context.redirect('/home');
            })
    })

    this.get('/delete/:id', function(context){
        let id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})
            .then(function(){
                context.redirect('/home');
            })
    })
})



router.run('/home')


function loadPartials(context, extra){
    let user = localStorage.getItem('user');
    if (user) {
        context.logged = true;
    }
    return context.loadPartials({header: '../templates/header.hbs', footer: '../templates/footer.hbs', ...extra});
}

function compare(a,b){
    if (a.title > b.title) {
        return 1;
    }else if (a.title < b.title) {
        return -1;
    }
    return 0;
}