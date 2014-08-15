'use strict';
// Toolbar controls
var gui = require('nw.gui');
var Window = gui.Window.get();

function minimize() {
    Window.minimize();
}

function toggleFullscreen() {
    Window.toggleKioskMode();
}

function closeWindow() {
    Window.close();
}

// Login panel animation
$(document).ready(function() {
    $('#signup,#signin').click(function(e) {
        e.preventDefault();
        $('div.form-auth').toggle('500');
    });
});

// Firebase authentication
var myRef = new Firebase("https://xxxx.firebaseio.com");
var auth = new FirebaseSimpleLogin(myRef, function(error, user) {
    if (error) {
        if (error.code == 'INVALID_EMAIL') {
            alert('Please enter a valid email address');
        } else if (error.code == 'INVALID_PASSWORD' || error.code == 'INVALID_USER') {
            alert('Invalid Email or Password');
        } else {
            alert("Something went wrong");
        }
    } else if (user) {

        if (location.href.indexOf('/home') < 0)
            window.location.assign('http://localhost:3000/home');

        if ($('#email').length > 0) {
            if (user.provider == 'twitter')
                $('#email').text(user.username);
            else if (user.provider == 'facebook')
                $('#email').text(user.displayName);
            else if (user.provider == 'google')
                $('#email').text(user.displayName);
            else if (user.provider == 'password')
                $('#email').text(user.email);
        }

    } else {
        if (location.href.indexOf('/home') > 0)
            window.location.assign('http://localhost:3000');
    }
});

function signup() {
    // validate the form
    var e = $('#signup_email').val().trim(),
        p = $('#signup_pwd').val().trim(),
        rp = $('#signup_rpwd').val().trim();

    if (e.length > 0 && p.length > 0 && rp.length > 0) {
        if (p == rp) {
            auth.createUser(e, p, function(error, user) {
                if (error === null) {
                    // login the user
                    auth.login('password', {
                        email: e,
                        password: p
                    });
                } else {
                    if (error.code == 'INVALID_EMAIL') {
                        alert('Please enter a valid email address');
                    } else if (error.code == 'EMAIL_TAKEN') {
                        alert('This email address is already in use. Please try logging in.');
                    } else {
                        alert("Error creating user");
                    }
                }
            });
        } else {
            alert('Passwords do not match');
            return false;
        }
    } else {
        alert('Please enter valid credentials');
        return false;
    }
}

function signin() {
    // validate the form
    var e = $('#signin_email').val().trim(),
        p = $('#signin_pwd').val().trim();
    if (e.length > 0 && p.length > 0) {
        auth.login('password', {
            email: e,
            password: p
        });
    } else {
        alert('Please enter valid credentials');
        return false;
    }
}

function logout() {
    auth.logout();
}

function login(provider) {
    auth.login(provider);
}
