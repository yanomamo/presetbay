angular.module('scotchTodo').controller('settingsController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.links = [];

  if (userInfo.data.username) {
    $scope.links = userInfo.data.info.links;
    $scope.userDiscription = userInfo.data.info.bio;
  }

  $scope.$parent.activeTab = 3;

  $scope.saveDescription = function (userId) {
    $http.post('/api/users/updateDescription', {
      _id: userId,
      info: $scope.userDiscription
    })
    .success(function () {
      mixpanel.track("User updated info");
    })
    .error(function(err){
      console.log(err);
    })
  }

  $scope.addLink = function (userId) {
    var linkObj = {
      title: $scope.newLinkTitle,
      address: $scope.newAddressUrl
    }

    $http.post('/api/users/updateLink', {
      _id: userId,
      link: linkObj
    })
    .success(function () {
      mixpanel.track("User added link");
      $scope.newLinkTitle = '';
      $scope.newAddressUrl = '';
    })
    .error(function(err){
      console.log(err);
    })

    // the object was added in the db, but not locally just yet
    $scope.links.push(linkObj);
  }

  $scope.deleteLink = function (linkObj, userId) {
    $http.post('/api/users/deleteLink', {
      _id: userId,
      link: linkObj
    })
    .success(function () {
      mixpanel.track("User deleted link");
    })
    .error(function(err){
      console.log(err);
    })

    // refresh user info after link added to db
    var i = $scope.links.indexOf(linkObj);
    if (i > -1) {
      $scope.links.splice(i, 1);
    }
  }
  
});