angular.module('scotchTodo').controller('profileController', function ($scope, $http, $routeParams, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.profileUser = {};
  $scope.profileActiveTab = 2;
  $scope.loading = false;

  $scope.loadPresets = function (presetIds) {
    $scope.profileView = 0;
    $scope.loading = true;
    $scope.presets = [];

    $http.post('/api/presets/getUserDownloads', {
      downloads: presetIds
    })
    .success(function(presets) {
      $scope.presets = presets;
      $scope.loading = false;
    })
    .error(function(err) {
      console.log(err);
    })
  }

  $scope.getProfileTabClass = function (tabIndex) {
    return {active: tabIndex == $scope.profileActiveTab}
  }

  // first get user
  $http.get('/api/users/searchId/' + $routeParams.profileId)
    .success(function(user) {
      $scope.profileUser = user;
      $scope.profileView = 1;
    })
    .error(function(err) {
      console.log(err);
    })
});