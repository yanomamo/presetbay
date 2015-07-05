angular.module('scotchTodo', []).config( [
  '$compileProvider', '$routeProvider',
  function( $compileProvider, $routeProvider )
  {   
    var getUserInfo = function ($http) {
      return $http.get('/api/users/sessionUser')
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
          return null;
        });
    };

    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
    $routeProvider.when('/login', {
      templateUrl: 'templates/login',
      controller: 'loginController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).when('/library', {
      templateUrl: 'templates/library',
      controller: 'libraryController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).when('/search', {
      templateUrl: 'templates/search',
      controller: 'searchController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).when('/upload', {
      templateUrl: 'templates/upload',
      controller: 'uploadController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).when('/settings', {
      templateUrl: 'templates/settings',
      controller: 'settingsController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).when('/profile/:profileId', {
      templateUrl: 'templates/profile',
      controller: 'profileController',
      resolve: {
        userInfo: ['$http', getUserInfo]
      }
    }).otherwise({
      redirectTo: '/search'
    });
  }
]);