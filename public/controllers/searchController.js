angular.module('scotchTodo').controller('searchController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.$parent.activeTab = 0;
  $scope.loading = false;
  
  //$scope.searchedUsers = [];
  // used in library and search views
  $scope.updateSearchResults = function(userName, presetName, tags, fileType) {
    // delete current
    $scope.loading = true;
    $scope.searchedUsers = [];
    $scope.searchedPresets = [];

    if (userName) {
      $http.get('/api/users/search/' + userName)
        .success(function(data) {
          $scope.searchedUsers = data;
          $scope.loading = false;
          mixpanel.track("Searched by name");
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (presetName && fileType) {
      $http.get('/api/presets/name/' + presetName)
        .success(function(data) {
          mixpanel.track("Searched by preset");
          $scope.searchedPresets = data;
          $scope.loading = false;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (tags && fileType) {
      $http.post('/api/presets/tags', {
        tags: tags
      })
        .success(function(data) {
          $scope.searchedPresets = data;
          mixpanel.track("Searched by tags");
          $scope.loading = false;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else {
      $scope.loading = false;
    }
  }
});