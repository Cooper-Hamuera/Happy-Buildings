var app = angular.module('HappyB', []);

//[JS] Navagation bar tabs
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


//[Angular] Controller
app.controller('MainCtrl', function($scope, $http) {
    $scope.loginVisible = true;         //login visibility (Show/Hide)
    $scope.indexVisible = false;        //index visibility (Show/Hide)
    $scope.feedback = "";               //Stores feedback String
    $scope.username = "";               //Username field
    $scope.password = "";               //Password field
    $scope.usernameValid = false;       //Username validation
    $scope.passwordValid = false;       //Password validation


    //JSON login
    $scope.loginData = null;
    $scope.loginLocation = 'user_list.json';    //Local JSON file *requires HTML header source

      /**
      Server URL's

       $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/user_list.json';
       $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/coopersamu/user_list.json';

       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;

       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;

       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;

       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;
      **/

    $scope.get = $http.get($scope.loginLocation)      //Fetch the JSON file
        .then(
            function successCall(response) {
                $scope.loginData = response.data.users; //Saves json response into variable
            }, function errorCall(response) {
                $scope.feedback = "Error reading file: " + response.status;
                $scope.loginData = null; // if there is an error your data wont be populated
            }
        );

    $scope.checkLogin = function() {
        if ($scope.loginData === null) {
            $scope.feedback = "Sorry, error reading file";
        }
        for (i = 0; $scope.loginData !== null && i < $scope.loginData.length; i++) { //reads one element at a time
            if ($scope.loginData[i].LoginName == $scope.username) { //if that element, equals what the user has inputed
                $scope.usernameValid = true; //then the username is valid
            }
            if ($scope.loginData[i].Password == $scope.password) { //if that element equals the password the user has inputted
                $scope.passwordValid = true; // then the password is valid
            }
        }

        //check login data functions
        if ($scope.usernameValid && $scope.passwordValid) { //if both the username and password are contained in the server
            $scope.feedback = "Login successful as " + $scope.username; //your login will be successful and..
            $scope.loginVisible = false; //login form will then be hidden and..
            $scope.indexVisible = true; // the directory will be displayed
        } else {
            $scope.feedback = "Login failed";
        }
    };


    //cancel button clears the username and password fields
    $scope.cancelLogin=function(){
        $scope.username="";
        $scope.password="";
        $scope.feedback="";
    };

});
//[Angular] Controller End