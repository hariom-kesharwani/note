'use strict';

app.controller('add_note_ctrl', ['$scope', '$state', 'logger', '$localStorage','Note','$stateParams', function($scope, $state, logger, $localStorage,Note,$stateParams) {
    $scope.note = {
        text: ''
    }
    $scope.user = $localStorage.userInfo;
    $scope.isUpdate = false;
    $scope.addNote = function(){
        var params = {
            users_id: $scope.user.user_id,
            text: $scope.note.text
        }
        if($stateParams.noteId){
            params.noteId = $stateParams.noteId;
        }
        Note.createNEditNote().save(params,function (response) {
            if (response.code == 200) {
                logger.logSuccess(response.msg);
                $state.go("app.note.list");
            }else{
                logger.logError(response.msg);
            }
        });
    }
    if($stateParams.noteId){
        Note.getNoteDetail($stateParams.noteId).get(function (response) {
            if (response.code == 200) {
                $scope.note = {
                    text: response.data.text,
                };
                $scope.isUpdate = true;
            }else{
                logger.logError(response.msg);
                $state.go("app.note.list")
            }
        });
    }
    
}]);


app.controller('note_list_ctrl', ['$scope', '$http','$state', 'logger','Note','$localStorage',function ($scope, $http, $state, logger,Note,$localStorage) {

    $scope.currentPage = 1;
    $scope.records_per_page = 10;
    $scope.pageChanged = () => {
        $scope.get_data();
    };

    $scope.pageChangedCount = () => {
        $scope.get_data();
    };
    $scope.filter = {
        text: ""
    };
    
    $scope.get_data = function () {
        var params = {
            property_id: $scope.user.property_id,
            page_number: $scope.currentPage,
        };
        if($scope.filter.text){
            params.text = $scope.filter.text;
        }
        Parking.list_note().save(params, function (response, err) {
            if (response.code == 200) {
                $scope.noteData = response.data;
                $scope.itemCount = response.item_count;
            }
        })
    };
    $scope.get_data();
    $scope.reverseSort = true;
    $scope.sortData = function (columnIndex) {
        if(!empty($scope.headersValue[columnIndex])){
            $scope.reverseSort = ($scope.sortColumn == $scope.headersValue[columnIndex]) ? !$scope.reverseSort : false;
            $scope.sortColumn = $scope.headersValue[columnIndex];
        }
    }
    $scope.clearfilter = function(){
        $scope.search = '';
        $scope.get_data();
    }
}]);
