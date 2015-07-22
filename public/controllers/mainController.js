angular.module('scotchTodo').controller('mainController', function mainController($scope, $http, $location) {
  $scope.formData = {};
  $scope.searchOption = 1;
  $scope.user = {};
  $scope.activeTab = 0;
  $scope.adCycle = 0;

  var userOfTheDay = {
    trackId: '191683919',
    userId: '55aaf406e21d26b74c000002',
    collab: true
  }

  $http.get('/api/presets/count')
  .success(function(data) {
    $scope.presetCount = data.count;
  })
  .error(function(err){
    console.log(err);
  })

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
        mixpanel.track("Preset downloaded");
      })
      .error(function (){
        console.log('preset download post failed')
      })
  }

  // TODO: add this to a service
  //####### Soundcloud controller logic ###############
  $scope.track = {};
  $scope.playing = false;
  $scope.clicked = false;

  SC.initialize({
    client_id: '2dea4d7cb59c9f86f7b9c2d8744ade69'
  });

  SC.get('/tracks/' + userOfTheDay.trackId, function(data, err) {
    $scope.$apply(function() {

      var fullUserImage = data.user.avatar_url.replace('large', 't500x500'); // gets full res

      $scope.artist = {
        _id: userOfTheDay.userId, // use for presetbay profile
        albumArt: data.artwork_url,
        name: data.user.username,
        trackTitle: data.title,
        image: fullUserImage,
        collab: userOfTheDay.collab
      }
    })
  })

  $scope.play = function () {
    SC.stream('/tracks/' + userOfTheDay.trackId, function(track) {
      $scope.track = track;
      $scope.track.play();
    })
    $scope.clicked = true;
    $scope.playing = true;
  }

  $scope.stop = function () {
    $scope.track.stop();
    $scope.playing = false;
  }

});