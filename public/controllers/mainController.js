angular.module('scotchTodo').controller('mainController', function mainController($scope, $http, $location) {
  $scope.formData = {};
  $scope.searchOption = 1;
  $scope.user = {};
  $scope.activeTab = 0;

  $scope.goTo = function (path) {
    $location.path(path);
  }

  $scope.getTabClass = function (tabIndex) {
    return {active: tabIndex == $scope.activeTab}
  }

  $scope.getHighlight = function (tabIndex) {
    return {highlighted: tabIndex == $scope.activeTab}
  }

  $scope.logout = function () {
    $http.post('/api/users/sessionDelete')
      .success(function() {
        $scope.user = {};
        $scope.goTo('/login');
        console.log('logged out!');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }

  $scope.savePresetToUser = function (presetId, userId) {
    if (userId){
      $http.post('/api/users/updateDownloads', {
        _id: userId,
        presetId: presetId
      })
      .success(function(preset) {
        console.log('Preset saved to users library');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

        // increment download counter
    $http.post('/api/presets/downloaded', {
        _id: presetId
      })
      .success(function(){
        console.log('preset downloaded');
      })
      .error(function (){
        console.log('preset download post failed')
      })
  }

  // delete a todo after checking it
  $scope.deleteTodo = function(id) {
    $http.delete('/api/presets/' + id)
      .success(function(data) {
        $scope.presets = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };
});