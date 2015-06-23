var scotchTodo = angular.module('scotchTodo', [])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
    }
]);

function mainController($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all todos and show them
  $http.get('/api/presets')
    .success(function(data) {
      $scope.presets = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // when submitting the add form, send the text to the node API
/*  $scope.createTodo = function() {
    console.log($scope.formData);

    $http.post('/api/presets', $scope.formData)
      .success(function(data) {
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.presets = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };*/

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

  document.getElementById('file-upload').addEventListener('change', handleFileSelect, false);
}
