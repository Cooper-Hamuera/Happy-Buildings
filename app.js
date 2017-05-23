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


//[Angular] Controller index
app.controller('MainCtrl', function($scope, $http) {
    $scope.loginVisible = false;         //login visibility (Show/Hide)
    $scope.indexVisible = true;        //index visibility (Show/Hide)
    $scope.feedback = "";               //Stores feedback String
    $scope.username = "";               //Username field
    $scope.password = "";               //Password field
    $scope.usernameValid = false;       //Username validation
    $scope.passwordValid = false;       //Password validation

    //user access type
    $scope.user_admin = false;
    $scope.user_manager = false;
    $scope.user_owner = false;
    $scope.user_contractor = false;


    //JSON file check and stores info for each file
    $scope.loginData = null;
    $scope.loginLocation = 'user_list.json';
    $scope.buildingData= null;
    $scope.buildingLocation = 'building_dir.json';
    $scope.project= null;
    $scope.projectLocation = 'project.json';
    $scope.work= null;
    $scope.workLocation = 'work.json';
    $scope.issue= null;
    $scope.issueLocation = 'issue.json';


    /**

       >>Local JSON file requires HTML header source
       >>Server URL's list

       $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/user_list.json';
       $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/coopersamu/user_list.json';

       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
       $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;

       $scope.project = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.json;
       $scope.project = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/project.json;

       $scope.work = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/work.json;
       $scope.work = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/work.json;

       $scope.issue = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/issue.json;
       $scope.issue = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/issue.json;

       **/

    $scope.get = $http.get($scope.loginLocation)                                //Fetch the JSON file from the location in the variable
        .then(
            function successCall(response) {
                $scope.loginData = response.data.users;                         //Saves json response into this variable
            }, function errorCall(response) {
                $scope.feedback = "Error reading file: " + response.status;     // displays feedback error if JSON form incorrect
                $scope.loginData = null;                                        // incorrect JSON form will keep it set at null
            }
        );

    $scope.checkLogin = function() {
        if ($scope.loginData === null) {
            $scope.feedback = "Sorry, error reading file";
        }
        for (i = 0; $scope.loginData !== null && i < $scope.loginData.length; i++) {    //reads one element at a time from the user list
            if ($scope.loginData[i].LoginName == $scope.username) {                     //if in the element, username equals what the user has inputted
                $scope.usernameValid = true;                                            //then the username is valid
            }
            if ($scope.loginData[i].Password == $scope.password) {                      //if in the element, password equals what the user has inputted
                $scope.passwordValid = true;                                            //then the password is valid
            }
            if ($scope.loginData[i].UserType == "admin"){                               //if in the element check the user type is admin, set to true
                $scope.user_admin = true;
            }else if($scope.loginData[i].UserType == "manager"){                        //if in the element check the user type is manager, set to true
                $scope.user_manager = true;
            }else if($scope.loginData[i].UserType == "owner"){                          //if in the element check the user type is owner, set to true
                $scope.user_owner = true;
            }else if($scope.loginData[i].UserType == "contractor"){                     //if in the element check the user type is contractor, set to true
                $scope.user_contractor = true;
            }
        }

        //check login data functions
        if ($scope.usernameValid && $scope.passwordValid) {                     //if both the username and password are contained in the server
            $scope.feedback = "Login successful as " + $scope.username;         //Login feedback displayed
            $scope.loginVisible = false;                                        //Hide login form
            $scope.indexVisible = true;                                         //Show index
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