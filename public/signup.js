function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('psw');
    var txtRePassword = document.getElementById('psw-repeat')
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignUp = document.getElementById('btnSignUp');
    var txtusername = document.getElementById('username');
    //var btnusernamesubmit = document.getElementById('usernamesubmit');
    btnGoogle.addEventListener('click', function() {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()"
        var provider = new firebase.auth.GoogleAuthProvider();
        //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            var Ref = firebase.database().ref('Username_list');
            console.log(user.displayName);
            console.log(user.email);
            var data = {
                Username: user.displayName,
                email: user.email
            };
            Ref.push(data).then(function(){
                create_alert("success", result);
                window.location.href = "index.html";
            });
            
        }).catch(function(error) {
            create_alert('error', error.message);
        });


    });
    btnSignUp.addEventListener('click', function() {
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        console.log(txtEmail.value)
        console.log(txtPassword.value)
        if(txtPassword.value === txtRePassword.value){
            firebase.auth().createUserWithEmailAndPassword(txtEmail.value, txtPassword.value).then(function(result) {
                var Ref = firebase.database().ref('Username_list');
                var data = {
                    Username: txtusername.value,
                    email: txtEmail.value
                };
                txtEmail.value = "";
                txtPassword.value = "";
                txtusername.value ="";
                txtRePassword.value="";
                Ref.push(data).then(function(){
                    //create_alert("success", result);
                    window.alert("success");
                    window.location.href = "index.html";
                });
            }).catch(function(error) {
                txtEmail.value = "";
                txtPassword.value = "";
                window.location.href = "signup.html"
                window.alert(error);
            });
        }
        else{
            txtEmail.value = "";
            txtPassword.value = "";
            txtRePassword.value = "";
            window.location.href = "signup.html"
            window.alert("Please retype matching passwords");
        }
    });
}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}

window.onload = function() {
    initApp();
};