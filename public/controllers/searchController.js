angular.module('scotchTodo').controller('searchController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.$parent.activeTab = 0;
  $scope.loading = false;
  
  $http.get('/api/presets/all/Massive')
  .success(function(data) {
    $scope.searchedPresets = data;
    $scope.loading = false;
  })
  .error(function(data) {
    console.log('Error: ' + data);
  });

  $http.get('/api/users/all')
    .success(function(data) {
      $scope.searchedUsers = data;
      $scope.loading = false;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // used in library and search views
  $scope.updateSearchResults = function(userName, presetName, tags, fileType, option) {
    // delete current
    $scope.loading = true;
    $scope.searchedUsers = [];
    $scope.searchedPresets = [];

    if (option){
      if (option.user) {
        $http.get('/api/users/all')
          .success(function(data) {
            $scope.searchedUsers = data;
            $scope.loading = false;
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
        } else if (option.patch) {
          $http.get('/api/presets/all/' + option.patch.name)
            .success(function(data) {
              $scope.searchedPresets = data;
              $scope.loading = false;
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        }

      if (option.name) {
        $http.get('/api/presets/all/' + option.name)
          .success(function(data) {
            $scope.searchedPresets = data;
            $scope.loading = false;
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });

        if (option.refreshUsers == 0) {
          $http.get('/api/users/all')
            .success(function(data) {
              $scope.searchedUsers = data;
              $scope.loading = false;
            })
            .error(function(data) {
              console.log('Error: ' + data);
            });
        }

        return;
      }
    }

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
      $http.post('/api/presets/name/', {
         name: presetName,
         app: fileType.name
      })
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
        tags: tags,
        app: fileType.name
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