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

    //JSON file check and stores info for each file
    $scope.loginData = null;
    $scope.loginLocation = 'user_list.json';

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
            }
            if ($scope.loginData[i].UserType == "admin"){                               //if in the element check the user type is admin, set to true
                $scope.adminView = true;
            }else if($scope.loginData[i].UserType == "manager"){                        //if in the element check the user type is manager, set to true
                $scope.adminView = false;
            }else if($scope.loginData[i].UserType == "owner"){                          //if in the element check the user type is owner, set to true
                $scope.adminView = false;
            }else if($scope.loginData[i].UserType == "contractor"){                     //if in the element check the user type is contractor, set to true
                $scope.adminView = false;
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

    $scope.building_ID = "";
    $scope.building_Owner = "";
    $scope.building_Address = "";
    $scope.building_Type =  "";
    $scope.building_ConstructionDate = "0001-01-01T00:00:00";


    /*Add to Building Directory JSON*/
    var AddBuildingId = $scope.building_ID;
    var AddBuildingOwner = $scope.building_Owner;
    var AddBuildingAddress = $scope.building_Address;
    var AddBuildingType = $scope.building_Type;
    var AddConstructionDate = $scope.building_ConstructionDate;
    var read = $scope.buildingdirLocation;
    var write = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.building.json';
    var sourceObjBuilding = {
        "ID": AddBuildingId,
        "Owner": AddBuildingOwner,
        "Address": AddBuildingAddress,
        "BuildingType": AddBuildingType,
        "ConstructionDate": AddConstructionDate
    };
    $scope.AddBuilding = function() {                   //adds element to the building directory JSON
        var AddBuildingId = $scope.building_ID;
        var AddBuildingOwner = $scope.building_Owner;
        var AddBuildingAddress = $scope.building_Address;
        var AddBuildingType = $scope.building_Type;
        var AddConstructionDate = $scope.building_ConstructionDate;
        var sourceObjBuilding = {
            "ID": AddBuildingId,
            "Owner": AddBuildingOwner,
            "Address": AddBuildingAddress,
            "BuildingType": AddBuildingType,
            "ConstructionDate": AddConstructionDate
        };
        $scope.$promise1 = $http
        ({
            method: "POST",
            url: write,
            data: sourceObjBuilding,
            headers: {'Content-Type': 'application/json'}
        }).then(function successCall(response) {
                $scope.building_feedback = "Post>> " + JSON.stringify(sourceObjBuilding);
            }, function errorCall(response) {
                $scope.building_feedback = "Error posting:" + " Status: "+ response.status + " Writing: " + JSON.stringify(sourceObjBuilding);
            }
        );
    }
    $scope.UpdateBuildingList = function() {                                                          //updates the display for the Building Directory
        $scope.promise2 = $http.get($scope.buildingdirLocation)
            .then(function successCall(response) {
                    $scope.building_feedback = "Get>> " + JSON.stringify(response.data);
                }, function errorCall(response) {
                    $scope.building_feedback = "Error getting: " + response.status;
                }
            );
        $scope.get = $http.get($scope.buildingdirLocation)                                //Fetch the JSON file from the location in the variable
            .then(
                function successCall(response) {
                    $scope.buildingdirData = response.data.buildings;                     //Saves json response into this variable
                }, function errorCall(response) {
                    $scope.buulding_feedback = "Error reading file: " + response.status;           // displays feedback error if JSON form incorrect
                    $scope.buildingdirData = null;                                        // incorrect JSON form will keep it set at null
                }
            );
    }

    //View building from Building Directory in Building Information based on the ID
    $scope.BuildingInfoBuildingId="";
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


//Project List
    /**Show Project List JSON
    $scope.project_feedback="waiting";
    $scope.myArray=[];
    var tmpArr=[];
    var x=2;
    var i=0;

    //project file checking loop
    for(var i=1; i<x; i++){
        //check each project.[i].json file
        $scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.'+[i]+'.json';

        $http.get($scope.projectLocation)
            .success(function(data){

                    //if $scope.BuildingInfoBuildingId == Project Building ID
                        // Show in the Project List
                            //ProjectID, Name, Status, StartDate, EndDate

            })
            .error(function(data){
                //send feedback saying no projects
                break; //break file scanning loop
                })

        x++;                //adds 1 to var x to create an infinite loop, only breaks on error
    }*/

//Project List
    /**$scope.project_feedback="waiting";
    $scope.myArray=[];
    var tmpArr=[];
    var x=2;
    var i=0;

    //project file checking loop
    for(var i=1; i<x; i++){
        //check each project.[i].json file
        $scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.'+[i]+'.json';

        $http.get($scope.projectLocation)
            .success(function(data){

                //if $scope.BuildingInfoBuildingId == Project Building ID
                // Show in the Project List
                //ProjectID, Name, Status, StartDate, EndDate

            })
            .error(function(data){
                //send feedback saying no projects
                break; //break file scanning loop
            })

        x++;                //adds 1 to var x to create an infinite loop, only breaks on error
    }*/
});
    app.controller('ProjectController', function($scope, $http) {
    $scope.project_feedback="waiting";
    $scope.ProjectFileArray=[];
    var tmpArr=[];
    var x=4;
    var i=0;

    //project file checking loop
    for(var i=1; i<x; i++) {
        //check each project.[i].json file
        $scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.' + [i] + '.json';

        $http.get($scope.projectLocation)
            .success(function(data) {
                    tmpArr = data;
                    $scope.ProjectFileArray.push(tmpArr);
                    $scope.project_feedback = 'Server Loaded';
                console.log(tmpArr.hasOwnProperty("ProjectID"));
                console.log(tmpArr.hasOwnProperty("Message"));
                }
            );


        }

    });



    /**$scope.get = $http.get($scope.buildingdirLocation)                                //Fetch the JSON file from the location in the variable
        .then(
            function successCall(response) {
                $scope.buildingdirData = response.data.buildings;                     //Saves json response into this variable
            }, function errorCall(response) {
                $scope.feedback = "Error reading file: " + response.status;           // displays feedback error if JSON form incorrect
                $scope.buildingdirData = null;                                        // incorrect JSON form will keep it set at null
            }
        );

    $scope.building_ID = "";
    $scope.building_Owner = "";
    $scope.building_Address = "";
    $scope.building_Type =  "";
    $scope.building_ConstructionDate = "0001-01-01T00:00:00";*/

    /**for(var i=1; i<x; i++){
        $scope.projectLocation = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/project.'+[i]+'.json';

        $http.get($scope.projectLocation)
        .then(
            function successCall(response){
                tmpArr= response.Data;
                $scope.myArray.push(tmpArr);
                $scope.project_feedback='Server Loaded';
            }, function errorCall(response) {
                $scope.project_feedback = "Error getting: " + response.status;          // displays feedback error if JSON form incorrect
                $scope.projectFetchError=true;                                      // incorrect JSON form will keep it set at null
            }
            );
        if($scope.project_FetchError==true){
            break; //stops scanning for project ID's
        }else if($scope.project_FetchError==false){
            //project ID contains building ID==
        }
    }

/**

    /**Show Project List for building

    //$scope.work_Type=sourceObjProj[TypeOfWork];
    //$scope.proj_Status=[Status];

    var AddProjId = $scope.project_ID;
    var AddProjName = $scope.project_Name;
    var AddProjBuildingId = $scope.project_buildingId;
    var AddProjStatus = $scope.project_Status;
    var AddProjStartDate = $scope.project_StarDate;
    var AddProjEndDate = $scope.project_EndDate;
    var AddProjContactPers = $scope.project_ContactPers;
    var AddProjStatus = $scope.project_Status;
    var AddProjManager = $scope.project_Manager;
    var AddProjContractor = $scope.project_Contractor;

    //var AddProjWorkType = $scope.proj_workType[TypeOfWork];
    //var AddProjWorkStatus = $scope.proj_workStatus[Status];

    var writeProj = 'https://happybuildings.sim.vuw.ac.nz/api/edwardlewi/update.project.json';
    var sourceObjProj = {
        "ProjectID": projNr,
        "Name": "Painting",
        "BuildingID": "234",
        "Status":"Active",
        "StartDate":"2016-12-12T00:00:00",
        "EndDate":"2016-12-14T00:00:00",
        "ContactPerson":"Joe Bloggs",
        "ProjectManager":"Sally Smith",
        "Contractor":"ABC Company",
        "Works":
            [
                {"TypeOfWork":"Scaffolding","Status":"Done"},
                {"TypeOfWork":"Painting","Status":"In-progress"}
            ],
        "Comments":
            [
                {"Author":"Glenn Aitchison","Text":"Initial work done"},
                {"Author":"Glenn Aitchison","Text":"Had painting started by tue 12/16"}
            ]
    };
    $scope.AddBuilding = function() {                   //adds element to the building directory JSON
        var AddProjId = $scope.project_ID;
        var AddOwner = $scope.building_Owner;
        var AddAddress = $scope.building_Address;
        var AddBuildingType = $scope.building_Type;
        var AddConstructionDate = $scope.building_ConstructionDate;
        var sourceObj = {
            "ID": AddId,
            "Owner": AddOwner,
            "Address": AddAddress,
            "BuildingType": "Castle",
            "ConstructionDate": "0001-01-01T00:00:00"
        };
        $scope.$promise1 = $http
        ({
            method: "POST",
            url: write,
            data: sourceObj,
            headers: {'Content-Type': 'application/json'}
        }).then(function successCall(response) {
                $scope.building_feedback = "Post>> " + JSON.stringify(sourceObj);
            }, function errorCall(response) {
                $scope.building_feedback = "Error posting:" + " Status: "+ response.status + " Writing: " + JSON.stringify(sourceObj);
            }
        );
    }
    $scope.UpdateProjectList = function() {                                                          //updates the display for the Building Directory
        $scope.promise2 = $http.get($scope.buildingdirLocation)
            .then(function successCall(response) {
                    $scope.building_feedback = "Get>> " + JSON.stringify(response.data);
                }, function errorCall(response) {
                    $scope.building_feedback = "Error getting: " + response.status;
                }
            );
        $scope.get = $http.get($scope.buildingdirLocation)                                //Fetch the JSON file from the location in the variable
            .then(
                function successCall(response) {
                    $scope.buildingdirData = response.data.buildings;                     //Saves json response into this variable
                }, function errorCall(response) {
                    $scope.feedback = "Error reading file: " + response.status;           // displays feedback error if JSON form incorrect
                    $scope.buildingdirData = null;                                        // incorrect JSON form will keep it set at null
                }
            );
    }
*/

//});
//[Angular] Controller End
