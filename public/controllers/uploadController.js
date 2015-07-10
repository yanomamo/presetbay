angular.module('scotchTodo').controller('uploadController', function ($scope, $http, userInfo) {
  $scope.$parent.user = userInfo.data;
  $scope.uplaodProgress = '';
  $scope.currentFileUploading = '';
  $scope.tags = ['', '', ''];
  var uploadCount = 0;
  $scope.$parent.activeTab = 2;
  $scope.checked = false;

  var handleFileSelect = function(evt) {
    var files = evt.target.files;
    var presetIds = [];
    var userId;
    var ownerName;

    // if (files.length > 100) {
    //   alert('Sorry, you can only upload up to 100 files at once. Please select fewer files and try again!');
    //   return;
    // }

    if ($scope.user.username) {
      userId = $scope.user._id;
      ownerName = $scope.user.username;
    } else {
      userId = null;
      ownerName = "Anonymous";
    }

    if (files) {
      // for each file encode and upload
      var i = 0;
      var loop = setInterval(function(){

        if(i < files.length) {
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
              file: btoa(binaryString),
              tags: $scope.tags,
              owner: userId,
              ownerName: ownerName
            })
              .success(function(data) {
                presetIds.push(data._id);
                console.log(data);

                uploadCount++;
                $scope.currentFileUploading = n + e;
                $scope.uploadProgress = 'Uploaded ' + uploadCount.toString() + ' of ' + files.length.toString();
              })
              .error(function(data) {
                console.log('Error: ' + data);
              });
          };
          reader.readAsBinaryString(files[i]);
        }

        i++;
        if(i === files.length + 1) {

          // now that all the ids are saved, update user if exists
          if (userId) {
            $http.post('/api/users/updateUploads', {
              _id: userId,
              presetIds: presetIds
            })
              .success(function(data) {
                //console.log(data); no data to print
              })
              .error(function(data) {
                console.log('Error: ' + data);
              });
          }
          uploadCount = 0;
          clearInterval(loop);
        }
      }, 500);
    }
  };

  //identifies upload button
  document.getElementById('file-upload').addEventListener('change', handleFileSelect, false);
});