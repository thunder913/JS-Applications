removeUserData();
let loadingBox = document.querySelector('.loadingBox');
let infoBox = document.querySelector('.infoBox');
let errorBox = document.querySelector('.errorBox');
let infoBoxTimeout;
const baseUrl = 'https://destinationsproject-32a99-default-rtdb.firebaseio.com/destinations/';
const router = Sammy('#container', function(){

    this.use('Handlebars', 'hbs');

    this.get('/home',function(context){
        showLoadingBox();
        loadPartials(context)
            .then(function(){
                if (context.logged) {
                    fetch(`${baseUrl}.json`)
                        .then(data=>data.json()
                        .then(data=>{
                            if (data) {
                                let keys = Object.keys(data);
                                let destinationsArr = [];
                                for (const key of keys) {
                                    destinationsArr.push({...data[key], id: key});
                                }
                                context.destinations = destinationsArr;
                                this.partial('../static/templates/home.hbs');
                                hideLoadingBox();
                            }
                        })
                )}else{
                    this.partial('../static/templates/home.hbs');
                    hideLoadingBox();
                }})
            })

    this.get('/register', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/register.hbs');
                hideLoadingBox();
            })
    })

    this.post('/register', function(context){
        showLoadingBox();
        const {email, password, rePassword} = context.params;
        if (password !== rePassword || password.length < 6) {
            showErrorBox('The password must be at least 6 characters and must match!');
            hideLoadingBox();
        }
        else if (!email) {
            showErrorBox('The email field should be filled!');
            hideLoadingBox();
        }else{
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(data){
                showInfoBox('User registration successful.');
                saveUserData(email, data.user.uid);
                loadPartials(context)
                    .then(function(){
                        context.redirect('/home');
                    })
            })
            .catch(err=>{
                if (err.code === 'auth/invalid-email') {
                    showErrorBox('An invalid email has been entered!');
                }else if (err.code === 'auth/email-already-in-use') {
                    showErrorBox('An account with this email already exists!');
                }else{
                    showErrorBox('There has been an error, try again!');
                }
                hideLoadingBox();
                return;
            })
    }
    })

    this.get('/login', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/login.hbs');
                hideLoadingBox();
            })
    })

    this.post('/login', function(context){
        showLoadingBox();
        const {email, password} = context.params;
        if (password.length < 6) {
            showErrorBox('The password must be at least 6 characters and must match!');
            hideLoadingBox();
        }else if (!email) {
            showErrorBox('The email field should be filled!');
            hideLoadingBox();
        }else{
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(data){
                    showInfoBox('Login successful.');
                    saveUserData(email, data.user.uid);
                    loadPartials(context)
                        .then(function(){
                            context.redirect('/home');
                        })
                })
                .catch(err=>{
                    if (err.code === 'auth/user-not-found') {
                        showErrorBox('There is no user registered with this email!');
                    }
                    else if (err.code === 'auth/wrong-password') {
                        showErrorBox('Invalid password!')
                    }else if (err.code === 'auth/invalid-email') {
                        showErrorBox('An invalid email has been entered!');
                    }else{
                        showErrorBox('There has been an error, try again!');
                    }
                    hideLoadingBox();
                })
        }
    })

    this.get('/logout', function(){
        removeUserData();
        showInfoBox('Logout successful.');
        this.redirect('/login');
    })

    this.get('/add', function(){
        showLoadingBox();
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/create.hbs');
                hideLoadingBox();
            })
    })

    this.post('/add', function(context){
        showLoadingBox();
        const {destination, city, duration, departureDate, imgUrl} = context.params;

        if (!destination || !city || !duration || !departureDate || !imgUrl) {
            showErrorBox('All inputs must be filled!');
            hideLoadingBox();
        }else if (duration < 1 || duration > 100) {
            showErrorBox('Duration must be between 1 and 100!');
            hideLoadingBox();
        }
        else{
        let currentUser = getUserData().email;
        fetch(`${baseUrl}.json`, {method:'POST', body:JSON.stringify({destination,city,duration,departureDate,imgUrl, creator: currentUser})})
            .then(function(){
                showInfoBox('Successfully added!');
                context.redirect('/home');
            })
            .catch(err=>{
                hideLoadingBox();
                showErrorBox('There has been an error, try again!');
            })
    }})

    this.get('/details/:id',async function(context){
        showLoadingBox();
        const id = context.params.id;
        let destination = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        let currentUserEmail = getUserData().email;
        let owner = false;
        if (currentUserEmail === destination.creator) {
            owner = true;
        }
        const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
        let splittedDate = destination.departureDate.split('-');
        let formattedDate = `${splittedDate[2]} ${monthNames[splittedDate[1]-1]} ${splittedDate[0]}`;
        destination.departureDate = formattedDate;
        destination = {...destination, id, owner}; 
        context.destination = destination;

        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/details.hbs');
                hideLoadingBox();
            })
    })

    this.get('/edit/:id',async function(context){
        showLoadingBox();
        const id = context.params.id;
        let destination = await fetch(`${baseUrl}${id}.json`).then(data=> data.json());
        context.destination = {...destination, id};
        loadPartials(context)
            .then(function(){
                this.partial('../static/templates/edit.hbs');
                hideLoadingBox();
            })
    })

    this.post('/edit/:id', function(context){
        showLoadingBox();
        let {destination, city, duration, departureDate, imgUrl, id} = context.params;
        if (!destination || !city || !duration || !departureDate || !imgUrl) {
            showErrorBox('All inputs should be filled!');
            hideLoadingBox();
        }else if (duration < 1 || duration > 100) {
            showErrorBox('Duration must be between 1 and 100!');
            hideLoadingBox();
        }else{
        fetch(`${baseUrl}${id}.json`, {method:'PATCH', body: JSON.stringify({destination, city,duration,departureDate,imgUrl})})
            .then(function(){
                showInfoBox('Successfully edited destination.');
                context.redirect(`/details/${id}`);
            })
            .catch(err=>{
                hideLoadingBox();
                showErrorBox('There has been an error, try again!');
            })
    }})

    this.get('/destinations',async function(context){
        showLoadingBox();
        let currentUser = getUserData().email;
        let destinations = await fetch(`${baseUrl}.json`).then(data=> data.json());
        if (destinations) {
            let keys = Object.keys(destinations);
            let destinationsArr = [];
            for (const key of keys) {
                if (destinations[key].creator === currentUser) {
                    destinationsArr.push({...destinations[key], id:key});
                }
            }
            context.destinations = destinationsArr;
        }
        loadPartials(this)
            .then(function(){
                this.partial('../static/templates/myDestinations.hbs');
                hideLoadingBox();
            })
    })

    this.get('/remove/:id', function(context){
        showLoadingBox();
        const id = context.params.id;
        fetch(`${baseUrl}${id}.json`, {method:'DELETE'})
            .then(function(){
                showInfoBox('Destination deleted.');
                context.redirect('/destinations');
            })
    })
})


router.run('/home');

function loadPartials(context){
    let user = getUserData();
    if (user) {
        context.logged = true;
        context.email = user.email;
    }
    return context.loadPartials({header: '../static/templates/header.hbs', footer: '../static/templates/footer.hbs'});
}

function saveUserData(email, uid){
    localStorage.setItem('user', JSON.stringify({email, uid}));
}

function getUserData(){
    return JSON.parse(localStorage.getItem('user'));
}

function removeUserData(){
    localStorage.removeItem('user');
}

function showLoadingBox() {
    loadingBox.style.display = 'block';
}

function hideLoadingBox() {
    loadingBox.style.display = 'none';
}

function showInfoBox(message) {
    clearTimeout(infoBoxTimeout);
    infoBox.style.display = 'block'
    infoBox.textContent = message;
    infoBoxTimeout = setTimeout(() => {
        console.log('done');
        infoBox.style.display = 'none';
    }, 3000);
}

function showErrorBox(message) {
    errorBox.style.display = 'block'
    errorBox.textContent = message;
}

infoBox.addEventListener('click', (e)=>{
    infoBox.style.display = 'none';
    clearTimeout(infoBoxTimeout);
})

document.addEventListener('click', function(){
    errorBox.style.display = 'none';
})