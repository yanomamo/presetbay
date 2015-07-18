var spotlightTracks = ['191683919'];

angular.module('scotchTodo').controller('mainController', function mainController($scope, $http, $location) {
  $scope.formData = {};
  $scope.searchOption = 1;
  $scope.user = {};
  $scope.activeTab = 0;

  // this section for getting the total count
  // $scope.presetCount = 0;

  // $http.get('/api/presets/total')
  // .success(function(data) {
  //   $scope.presetCount = data.count;
  // });

  $scope.goTo = function (path) {
    $location.path(path);
  }

  $scope.getTabClass = function (tabIndex) {
    return {active: tabIndex == $scope.activeTab}
  }

  $scope.getHighlight = function (tabIndex) {
    return {highlighted: tabIndex == $scope.activeTab}
  }

  $scope.logout = function () {
    $http.post('/api/users/sessionDelete')
      .success(function() {
        $scope.user = {};
        $scope.goTo('/login');
        console.log('logged out!');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }

  $scope.savePresetToUser = function (presetId, userId) {
    if (userId){
      $http.post('/api/users/updateDownloads', {
        _id: userId,
        presetId: presetId
      })
      .success(function(preset) {
        console.log('Preset saved to users library');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }

        // increment download counter
    $http.post('/api/presets/downloaded', {
        _id: presetId
      })
      .success(function(){
        console.log('preset downloaded');
      })
      .error(function (){
        console.log('preset download post failed')
      })
  }

  //Soundcloud controller logic
  $scope.track = {};
  $scope.playing = false;
  $scope.clicked = false;

  SC.initialize({
    client_id: '2dea4d7cb59c9f86f7b9c2d8744ade69'
  });

  SC.get('/tracks/191683919', function(data, err) {
    $scope.$apply(function() {
      console.log(data);
      $scope.artist = {
        _id: '559f720a54819dc12800002c',
        albumArt: data.artwork_url,
        name: data.user.username,
        trackTitle: data.title,
        image: data.user.avatar_url,
        tour: true,
        collab: true
      }
    })
  })

  SC.stream('/tracks/191683919', function(track) {
    $scope.track = track;
  })

  $scope.play = function () {
    $scope.track.play();
    $scope.clicked = true;
    $scope.playing = true;
  }

  $scope.stop = function () {
    $scope.track.stop();
    $scope.playing = false;
  }

});