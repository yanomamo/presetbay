angular.module('scotchTodo').controller('libraryController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.$parent.activeTab = 1;
  $scope.loading = false;

  //show library on load
  $http.post('api/presets/getUserDownloads', {
    downloads: $scope.user.downloads
  })
    .success(function(presets) {
      $scope.searchedPresets = presets;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });


    // used in library and search views
  $scope.updateLibraryResults = function(userName, presetName, tags, fileType) {

    $scope.loading = true;

    if (userName) {
      // get all presets with the username from the users presets
      $http.get('api/users/search/' + userName)
        .success(function(users) {
          $scope.searchedPresets = [];

          users.forEach(function(user) {
            $http.post('/api/presets/searchByUser/', {
              userId: user._id,
              presetIds: $scope.user.downloads
            })
              .success(function(presets) {
                $scope.searchedPresets = $scope.searchedPresets.concat(presets);
                mixpanel.track("Searched by name");
                $scope.loading = false;
              })
              .error(function(data) {
                console.log('Error: ' + data);
              });
            })
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (presetName && fileType) {
      $http.post('api/presets/query', {
        ids: $scope.user.downloads,
        name: presetName,
        app: fileType.name
      })
        .success(function(presets) {
          $scope.searchedPresets = presets;
          mixpanel.track("Searched by preset");
          $scope.loading = false;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (tags && fileType) {
      $http.post('api/presets/tags', {
        ids: $scope.user.downloads,
        tags: tags,
        app: fileType.name
      })
        .success(function(presets) {
          $scope.searchedPresets = presets;
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