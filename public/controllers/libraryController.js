angular.module('scotchTodo').controller('libraryController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  //console.log(userInfo.data.downloads);
  //console.log(userInfo.data.uploads);
  $scope.$parent.activeTab = 1;

  //show library on load
  $http.post('api/presets/getUserDownloads', {
    downloads: $scope.user.downloads
  })
    .success(function(presets) {
      $scope.searchedPresets = presets;
      console.log(presets);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });


    // used in library and search views
  $scope.updateLibraryResults = function(userName, presetName, tags, fileType) {

    if (userName) {
      // get all presets with the username from the users presets
      $http.get('api/users/search/' + userName)
        .success(function(users) {
          $scope.searchedPresets = [];
          console.log(users);

          users.forEach(function(user) {
            $http.post('/api/presets/searchByUser/', {
              userId: user._id,
              presetIds: $scope.user.downloads
            })
              .success(function(presets) {
                $scope.searchedPresets = $scope.searchedPresets.concat(presets);
                console.log(presets);
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
        name: presetName
      })
        .success(function(presets) {
          $scope.searchedPresets = presets;
          //console.log(users);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    } else if (tags && fileType) {
      $http.post('api/presets/tags', {
        ids: $scope.user.downloads,
        tags: tags
      })
        .success(function(presets) {
          $scope.searchedPresets = presets;
          //console.log(users);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }
  }
});