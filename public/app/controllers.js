angular.module('AppCtrl', ['AppServices'])
.controller('SignupCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
    $scope.user = {
        email: '',
        password: '',
        name: '',
        number: ''
    };
    $scope.userSignup = function() {
        $http.post('/api/users', $scope.user).then(function success(res) {
            $http.post("/api/auth", $scope.user).then(function success(res) {
                Auth.saveToken(res.data.token);
                $state.go("home")
            }, function error(err) {
                console.log("Uh oh. Login Failed.")
            })
        }, function error(err) {
        console.log("Error", err)
        })
    };
}])
.controller('LoginCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
    $scope.user = {
        email: '',
        password: ''
    };
    $scope.userLogin = function() {
        $http.post("/api/auth", $scope.user).then(function success(res) {
            Auth.saveToken(res.data.token);
            $state.go("home")
        }, function error(err) {
            console.log("Uh oh. Login Failed.")
        })
        }
}])
// .controller('AlertsCtrl', ['$scope', 'Alerts', function($scope, Alerts){
//     $scope.alerts = Alerts.getAll();
// }])
.controller('ProfileCtrl', ['$scope', '$http', '$state', '$location', 'Auth', 'UsersAPI', function($scope, $http, $state, $location, Auth, UsersAPI){
    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    console.log("User id " + curUser)
    console.log(UsersAPI.getUser(curUser))
    UsersAPI.getUser(curUser).then(function(user){
        console.log("Get dat user id: " + user.data.id)
        $scope.user = user.data
    })

    $scope.updateProfile =function(){
        UsersAPI.updateProfile($scope.user).then(function success(res){
            console.log(res)
            $location.path('/profile')
        }, function error(err){
            console.log(err);
        })
    }

    $scope.deleteProfile = function(id){
        console.log(id)
        UsersAPI.deleteProfile(id).then(function success(res){
            Auth.removeToken();
            $location.path('/');
        }, function error(err){
            console.log(err)
        })
    }

}])
.controller('NavCtrl', ['$scope', 'Auth', '$location', 'UsersAPI', function($scope, Auth, $location, UsersAPI) {
    $scope.number

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }
    $scope.logout = function() {
        console.log("Before Logout", Auth.getToken());
        Auth.removeToken();
        console.log("After Logout", Auth.getToken());
        $location.path("/login");
    };
    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    
    UsersAPI.getUser(curUser).then(function(user){
        console.log("phone number: " + user.data.number)
        $scope.number = user.data.number
    });
    $scope.Admin = function(){
        if (($scope.number == +14252238606) || ($scope.number == +12063840852)){
            return true;
        } else {
            return false;
        }
    };

}])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Message', 'Auth', 'UsersAPI', function($scope, $location, $http, Message, Auth, UsersAPI) {

    $scope.isLoggedIn = function() {
        return Auth.isLoggedIn();
    }

    $scope.tempUser = Auth.currentUser();
    var curUser = $scope.tempUser.id;
    UsersAPI.getUser(curUser).then(function(user){
        $scope.number = user.data.number
    })
    $scope.sendMsg = function(message, number) {
        Message.sendMessage(message, number).then(function success(res) {
            console.log("it's working, people " + res)
        },
        function error(err){
            console.log("it's not working, people " + err)
        })
    }
}])
