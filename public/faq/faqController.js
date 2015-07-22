angular.module('faq').controller('faqController', function ($scope, $http) {
  $scope.votes = {
    fm8: false,
    syl: false,
    nex: false,
    unk: false
  }
  $scope.suggestedPreset = '';
  $scope.submitted = false;
  $scope.voteCounts = {};

  $http.get('/api/vote')
  .success(function(data){
    $scope.voteCounts = data;
  })
  .error(function(data){
    console.log('Error: ' + data);
  })

  $scope.vote = function() {
    $http.post('/api/vote', {
      vote: $scope.votes,
      alternate: $scope.suggestedPreset
    })
      .success(function(data) {
        $scope.submitted = true;
        $scope.voteCounts = data;
        mixpanel.track("Voted");
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }
});