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
//Nav bar tabs

/**

 >>Local JSON file requires HTML header source
 >>Server URL's list

 $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/user_list.json';
 $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/coopersamu/user_list.json';

 $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json;
 $scope.buildingDir = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/building_dir.json;
 https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.building.json

 $scope.project = https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.[number].json;
 $scope.project = https://happybuildings.sim.vuw.ac.nz/api/coopersamu/project.[number].json;
 https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.project.json
 **/

//[Angular] Controller index
app.controller('MainCtrl', function($scope, $http) {
    $scope.loginVisible = true;         //login visibility (Show/Hide)
    $scope.indexVisible = false;        //index visibility (Show/Hide)
    $scope.adminView = false;           //admin visibility (Show/Hide)
    $scope.feedback = "";               //Stores feedback String
    $scope.username = "";               //Username field
    $scope.password = "";               //Password field
    $scope.usernameValid = false;       //Username validation
    $scope.passwordValid = false;       //Password validation
    $scope.userManager="manager";
    $scope.userOwner="owner";
    $scope.userContractor="contractor";

    //JSON file check and stores info for each file
    $scope.loginData = null;
    $scope.loginLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/user_list.json';

    $scope.buildingdirData = null;
    $scope.buildingdirLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/building_dir.json';
    $scope.projectData= null;
    //$scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.[number].json';


    /**Check Login JSON*/
    $scope.get = $http.get($scope.loginLocation)                                //Fetch the JSON file from the location in the variable
        .then(
            function successCall(response) {
                $scope.loginData = response.data.users;                         //Saves json response into this variable
            }, function errorCall(response) {
                $scope.feedback = "Error reading file: " + response.status;     // displays feedback error if JSON form incorrect
                $scope.loginData = null;                                        // incorrect JSON form will keep it set at null
            }
        );

    $scope.checkLogin = function() {                                                    //check and compare login entry
        if ($scope.loginData === null) {
            $scope.feedback = "Sorry, error reading file";
        }
        for (i = 0; $scope.loginData !== null && i < $scope.loginData.length; i++) {    //reads one element at a time from the user list
            if ($scope.loginData[i].LoginName == $scope.username) {                     //if in the element, username equals what the user has inputted
                $scope.usernameValid = true;                                            //then the username is valid

            }
            if ($scope.loginData[i].Password == $scope.password) {                      //if in the element, password equals what the user has inputted
                $scope.passwordValid = true;                                            //then the password is valid
                if($scope.loginData[i].UserType == $scope.userManager){                        //if in the element check the user type is manager, set to true
                    $scope.adminView = true;
                }
            }

        }

        //check login data functions
        if ($scope.usernameValid==false && $scope.passwordValid==false){
            $scope.feedback = "Username and Password Incorrect";
        }
        if ($scope.usernameValid==true && $scope.passwordValid==false){
            $scope.feedback = "Password Incorrect";
        }
        if ($scope.usernameValid && $scope.passwordValid) {                     //if both the username and password are contained in the server
            $scope.feedback = "Login successful as " + $scope.username;         //Login feedback displayed
            $scope.loginVisible = false;                                        //Hide login form
            $scope.indexVisible = true;                                         //Show index

        }
    };

    $scope.cancelLogin=function(){      //cancel button clears the username and password fields
        $scope.username="";
        $scope.password="";
        $scope.feedback="";
    };


    /**Show Building Directory JSON*/
    $scope.get = $http.get($scope.buildingdirLocation)                                //Fetch the JSON file from the location in the variable
        .then(
            function successCall(response) {
                $scope.buildingdirData = response.data.buildings;                     //Saves json response into this variable
            }, function errorCall(response) {
                $scope.feedback = "Error reading file: " + response.status;           // displays feedback error if JSON form incorrect
                $scope.buildingdirData = null;                                        // incorrect JSON form will keep it set at null
            }
        );


    $scope.AddBuilding = function () {
        $scope.buildingdirData.push({'ID':$scope.building_ID, 'Owner':$scope.building_Owner,
            'Address':$scope.building_Address, 'BuildingType':$scope.building_Type, 'ConstructionDate':$scope.building_ConstructionDate});

        var dataObjBuild = {
            ID : $scope.building_ID,
            Owner : $scope.building_Owner,
            Address : $scope.building_Address,
            BuildingType : $scope.building_Type,
            ConstructionDate : $scope.building_ConstructionDate,

        };
        var res = $http.post('https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.building.json', dataObjBuild);
        res.success(function(data, status, headers, config) {
            $scope.building_feedback = data;
            $scope.building_feedback = "Building Added";
        });
        res.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });

        $scope.building_ID='';
        $scope.building_Owner='';
        $scope.building_Address='';
        $scope.building_Type='';
        $scope.building_ConstructionDate='';
    };

    //View building from Building Directory in Building Information based on the ID
    $scope.BuildingInfoBuildingId=null;
    $scope.viewBuildingDetails = function(index){
        console.log($scope.buildingdirData[index].ID);
        $scope.BuildingInfoBuildingId=$scope.buildingdirData[index].ID;
        $scope.CurrentBuildingId = $scope.buildingdirData[index];
    }

    /*Select to edit building in Building Directory
     $scope.editBuilding = function(idx){
     $scope.buildingdirData.splice(idx,1)
     }*/

    //Select to remove building in Building Directory*/
    $scope.removeBuilding = function(idx){
        $scope.buildingdirData.splice(idx,1)
    }


});
app.controller('ProjectController', function($scope, $http) {

    $scope.BuildingInfoBuildingId=null;
    $scope.viewBuildingDetails = function(index){
        console.log($scope.buildingdirData[index].ID);
        $scope.BuildingInfoBuildingId=$scope.buildingdirData[index].ID;
        $scope.CurrentBuildingId = $scope.buildingdirData[index];
    }


    /**Read Project into List*/

    $scope.project_feedback="waiting";
    $scope.projectFileArray=[];
    var tmpArr=[];
    var x=20;
    var i=0;

    //project file checking loop
    for(var i=1; i<x; i++) {

        //check each project.[i].json file
        $scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.' + [i] + '.json';

        $http.get($scope.projectLocation)
            .success(function(data) {
                    tmpArr = data;
                    $scope.projectFileArray.push(tmpArr);
                    $scope.project_feedback = 'Server Loaded';
                    console.log(tmpArr.hasOwnProperty("ProjectID"));
                    console.log(tmpArr.hasOwnProperty("Message"));
                }
            );


    }

    /**Add Project into List*/
    $scope.AddProject = function () {
        $scope.projectFileArray.push({'ProjectID':$scope.project_Id, 'Name':$scope.project_Name,
            'BuildingID':$scope.project_BuildingId, 'Status':$scope.project_Status, 'StartDate':$scope.project_StartDate, 'EndDate':$scope.project_EndDate, 'ContactPerson':$scope.project_ContactPers, 'ProjectManager':$scope.project_Manager, 'Contractor':$scope.project_Contractor});

        var dataObjProj = {
            ProjectID : $scope.project_Id,
            Name : $scope.project_Name,
            BuildingID : $scope.project_BuildingId,
            Status : $scope.project_Status,
            StartDate : $scope.project_StartDate,
            EndDate : $scope.project_EndDate,
            ContactPerson : $scope.project_ContactPers,
            ProjectManager : $scope.project_Manager,
            Contractor : $scope.project_Contractor,
        };
        var res = $http.post('https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.project.json', dataObjProj);
        res.success(function(data, status, headers, config) {
            $scope.project_feedback = data;
            $scope.project_feedback = "Project Added";
        });
        res.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });

        $scope.project_Id='';
        $scope.project_Name='';
        $scope.project_BuildingId='';
        $scope.project_Status='';
        $scope.project_StartDate='';
        $scope.project_EndDate='';
        $scope.project_ContactPers='';
        $scope.project_Manager='';
        $scope.project_Contractor='';
    };

});