var scotchTodo = angular.module('scotchTodo', [])
.config( [
    '$compileProvider', '$routeProvider',
    function( $compileProvider, $routeProvider )
    {   
      var getUserInfo = function ($http) {
        return $http.get('/api/users/sessionUser')
          .success(function(data) {
            console.log(data);
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
      }).otherwise({
        redirectTo: '/search'
      });
    }
]);

scotchTodo.directive('ngSearch', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/searchDirective',
    replace: true,
    scope: {
      option: '=',
      updateResults: '&' 
    },
    link: function(scope) {

      scope.setOption = function (x) {
        scope.option = x;
      }

      scope.showOption = function (x) {
        return (x == scope.option);
      }
    }
  }
});

// Main controller!

scotchTodo.controller('mainController',
  function mainController($scope, $http, $location) {
    $scope.formData = {};
    $scope.searchOption = 0;
    $scope.user = {};

    $scope.goTo = function (path) {
      $location.path(path);
    }

    $scope.logout = function () {
      $http.post('/api/users/sessionDelete')
        .success(function() {
          $scope.user = {};
          console.log('logged out!');
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
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

    //UNTESTED
    $scope.updateResults = function(userName, presetName, tags, fileType) {
      if (tags && fileType && false) {
        $http.get('/api/presets/' + tags[0] + '/' + tags[1] + '/' + tags[2])
          .success(function(data) {
            $scope.presets = data;
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }

      console.log(userName);
      console.log(presetName);
      console.log(tags);
      console.log(fileType);

      console.log('searching!!');
    }

    var handleFileSelect = function(evt) {
      var files = evt.target.files;
      var paused = true;

      if (files) {

        // for each file uplaoded, encode
        var i = 0;
        var loop = setInterval(function(){
          var filename = files[i].name;
          var n = filename.replace(/\.[^/.]+$/, "");
          var e = filename.substr(filename.lastIndexOf('.'));

          var reader = new FileReader();
          reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;

            // send file to server
            $http.post('/api/presets', {
              name: n,
              extension: e,
              file: btoa(binaryString)
            })
              .success(function(data) {
                $scope.presets = data;
                console.log(data);
              })
              .error(function(data) {
                console.log('Error: ' + data);
              });
          };
          reader.readAsBinaryString(files[i]);

          i++;
          if(i === files.length) {
              clearInterval(loop);
          }
        }, 100);
      }
    };

    //identifies upload button
    //document.getElementById('file-upload').addEventListener('change', handleFileSelect, false);
  }
);

scotchTodo.controller('searchController',
  function ($scope, $http, userInfo) {
    $scope.$parent.user = userInfo.data;
  });

scotchTodo.controller('loginController',
  function ($scope, $http, userInfo) {
    $scope.user = userInfo.data;
    $scope.$parent.user = $scope.user;

    $scope.login = function (username, password) {
      $http.post('/api/users/login', {
        username: username,
        password: password
      })
        .success(function(data) {
          if (data.username) {
            $scope.user = data;
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
          } else {
            console.log(data.error);
          }
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };
  });

scotchTodo.controller('libraryController', 
  function ($scope, $http, userInfo) {
    $scope.$parent.user = userInfo.data;
  });

scotchTodo.controller('uploadController', function ($scope, $http, userInfo) {
    $scope.$parent.user = userInfo.data;
  });

scotchTodo.controller('settingsController', function ($scope, $http, userInfo) {
    $scope.$parent.user = userInfo.data;
  });

