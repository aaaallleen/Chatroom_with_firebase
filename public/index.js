function init(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {   
      document.getElementById('Chat').style.display = 'block';
      document.getElementById('Logout').style.display = 'block';
      document.getElementById('Login').style.display = 'none';
      document.getElementById('Signup').style.display = 'none';
      
    } else {
      document.getElementById('Login').style.display = 'block';
      document.getElementById('Signup').style.display = 'block';
      document.getElementById('Chat').style.display = 'none';
      document.getElementById('Logout').style.display = 'none';
    }
  });
}
function myFunction() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
        x.className += " responsive";
      } else {
        x.className = "topnav";
      }
  }
  function signup(){
    console.log("signup");
    window.location.href = "signup.html";
  }
  function login(){
    console.log("login");
    window.location.href = "signin.html";
  }
function chat(){
  console.log("chat");
  window.location.href ="chat.html";
}
function logout(){
      console.log("logout")
      firebase.auth().signOut().then(function() {
          window.alert("User sign out success!");
          window.location.href = "index.html";
      }).catch(function(error) {
          alert("User sign out failed!");
      });
}
window.onload = function() {
  init();
};