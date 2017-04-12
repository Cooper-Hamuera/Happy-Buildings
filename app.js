/**
 * Created by Lewis on 12/04/17.
 */
var app = angular.module('HappyB', []);

//sets feedback check to null
app.controller('MainCtrl', function($scope) {
    $scope.feedback = "";

    //check user input against password
    $scope.checkLogin=function(){
        var usernameAccess="admin";
        var passwordAccess="password";

        if($scope.if_username==usernameAccess & $scope.if_password==passwordAccess){
            $scope.feedback="login successful";
        }else{
            $scope.feedback="Username or Password incorrect";
        }
    };

    //cancel button clears the username and password fields
    $scope.cancelLogin=function(){
        $scope.if_username="";
        $scope.if_password="";
        $scope.if.feedback="";
    };

});
