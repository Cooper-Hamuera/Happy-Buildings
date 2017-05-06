var app = angular.module('HappyB', []);

//Navagation bar tabs
function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
//Navagation bar tabs


//Login feedback
app.controller('MainCtrl', function($scope) {
    $scope.feedback = "";

    //check user input against credentials listed
    $scope.checkLogin=function() {
        var usernameAccess = "admin";
        var passwordAccess = "password";

        if ($scope.if_username == usernameAccess & $scope.if_password == passwordAccess) {
            $scope.feedback = "Login Successful";

        }else{
            $scope.feedback="Username or Password Incorrect";
        }

    };

    //cancel button clears the username and password fields
    $scope.cancelLogin=function(){
        $scope.if_username="";
        $scope.if_password="";
        $scope.if.feedback="";
    };

});
//End Login feedback

//Hide feature
.module("hidemodule")
.controller('hidecontrol', function($scope){

    var x = document.getElementById('EiffelTower');
    $scope.loginpage=EiffelTower;

}
