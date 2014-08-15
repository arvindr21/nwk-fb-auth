'use strict';

ngAuth.controller('AppCtrl',
    function($rootScope, $scope, $window, $firebaseSimpleLogin) {
        var ref = new Firebase('https://xxxxx.firebaseio.com/');
        $rootScope.authClient = $firebaseSimpleLogin(ref);


        $rootScope.redirect = function(user) {
            if ($window.location.href.indexOf('home') < 0)
                $window.location.assign('http://localhost:3000/#home');

            $window.setTimeout(function() {
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
            }, 1000)

        };
        
        $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
            if (user) {
                $rootScope.redirect(user);
            }
        });

    }
).controller('Toolbar', ['$scope', 'Window',
    function($scope, Window) {
        $scope.minimize = function() {
            Window.minimize();
        };

        $scope.toggleFullscreen = function() {
            Window.toggleKioskMode();
        };

        $scope.close = function() {
            Window.close();
        };
    }
]).controller('AuthCtrl', function($rootScope, $scope) {

    var user = {
        email: '',
        password: '',
        rpassword: ''
    };

    //signup
    $scope.signup = function() {
        var user = $scope.user;
        if (!user || (!user.email || user.password.length == 0 || user.rpassword.length == 0)) {
            alert('Please enter valid credentials');
        } else {
            if (user.password == user.rpassword) {
                $rootScope.authClient.$createUser(user.email, user.password).then(function(user) {
                        $rootScope.redirect(user);
                    },
                    function(error) {
                        if (error.code == 'INVALID_EMAIL') {
                            alert('Please enter a valid email address');
                        } else if (error.code == 'EMAIL_TAKEN') {
                            alert('This email address is already in use. Please try logging in.');
                        } else {
                            alert("Error creating user");
                        }
                    });
            } else {
                alert('Passwords do not match');
            }
        }
    };

    // signin
    $scope.signin = function() {
        var user = $scope.user;
        if (!user || (!user.email || user.password.length == 0)) {
            alert('Please enter valid credentials');
        } else {
            $rootScope.authClient.$login('password', {
                email: user.email,
                password: user.password
            }).then(function(user) {
                    //alert("Successfully logged in", user);
                },
                function(error) {
                    if (error.code == 'INVALID_EMAIL') {
                        alert('Please enter a valid email address');
                    } else if (error.code == 'INVALID_PASSWORD' || error.code == 'INVALID_USER') {
                        alert('Invalid Email or Password');
                    } else {
                        alert("Something went wrong");
                    }
                });
        }
    };

    // social login
    $scope.login = function(provider) {
        $rootScope.authClient.$login(provider).then(function(user) {
            //console.log("Logged in as: " + user.uid);
        }, function(error) {
            //console.error("Login failed: " + error);
        });
    }

}).controller('HomeCtrl', function($rootScope, $scope) {
    $scope.logout = function() {
        $rootScope.authClient.$logout();
    };
});
