
let emailInput = document.querySelector('#email');
let passwordInput = document.querySelector('#password');
let loginButton = document.querySelector('#login');
let registerButton = document.querySelector('#register')
let signOutButton = document.querySelector('#signOut');

signOutButton.addEventListener('click', ()=>{
  firebase.auth().signOut().then(function() {
    alert('Signed Out')})
    .catch(()=>{
    alert('Sign Out Error');
})})

loginButton.addEventListener('click', ()=>{
  firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(()=> alert('You have successfully logged in!'))
    .catch(err => alert('There was an error logging in'));
})

registerButton.addEventListener('click', ()=>{
  firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(()=> alert('You have successfully created an account!'))
    .catch(() => alert('There was a problem creating your account!'))
})