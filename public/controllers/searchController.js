angular.module('scotchTodo').controller('searchController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.$parent.activeTab = 0;
  
  //$scope.searchedUsers = [];
  // used in library and search views
  $scope.updateSearchResults = function(userName, presetName, tags, fileType) {
    // delete current

    if (userName) {
      $http.get('/api/users/search/' + userName)
        .success(function(data) {
          $scope.searchedUsers = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (presetName && fileType) {
      $http.get('/api/presets/name/' + presetName)
        .success(function(data) {
          console.log(data);
          console.log($scope.searchOption);
          $scope.searchedPresets = data;
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
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }
  }
});