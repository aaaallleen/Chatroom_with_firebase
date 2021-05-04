function initApp() {
    // Login with Email/Password
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('psw');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btngoogle');

    btnLogin.addEventListener('click', function() {
        /// TODO 2: Add email login button event
        ///         1. Get user input email and password to login
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()" and clean input field
        firebase.auth().signInWithEmailAndPassword(txtEmail.value, txtPassword.value).then(function(result) {
            window.location.href = "index.html";
        }).catch(function(error) {
            txtEmail.value = "";
            txtPassword.value = "";
            create_alert("error", error);
        });
    });

    btnGoogle.addEventListener('click', function() {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()"
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
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
            Ref.push(data);
            create_alert("success", result);
            window.location.href = "index.html";
        }).catch(function(error) {
            create_alert('error', error.message);
        });


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