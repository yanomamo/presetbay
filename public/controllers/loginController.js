angular.module('scotchTodo').controller('loginController', function ($scope, $http, $location, userInfo) {
  $scope.user = userInfo.data;
  $scope.$parent.user = $scope.user;
  $scope.$parent.activeTab = 1;

  $scope.login = function (username, password) {
    $http.post('/api/users/login', {
      username: username,
      password: password
    })
      .success(function(data) {
        if (data.username) {
          $scope.user = data;
          $scope.goTo('/library');
          mixpanel.track("User logged in");
        } else {
          console.log(data.error);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.createUser = function (username, password) {
    // get user to see if they exist
    $http.post('/api/users', {
        username: username,
        password: password
      }).success(function(data) {
        if (data.username) {
          $scope.user = data;
          $scope.goTo('/library');
          mixpanel.track("User created");
        } else {
          console.log(data.error);
        }
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };
});