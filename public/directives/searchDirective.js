angular.module('scotchTodo').directive('ngSearch', function() {
  return {
    restrict: 'E',
    templateUrl: 'directives/searchDirective',
    replace: true,
    scope: {
      option: '=',
      updateResults: '&'
    },
    link: function(scope) {
      scope.types = [{name: 'Massive'}, {name: 'Sylenth1'}];
      scope.fileTypeSelection = scope.types[0];

      scope.setOption = function (x) {
        scope.option = x;
        scope.userNameInput = '';
        scope.presetNameInput = '';
        scope.tag1 = '';
        scope.tag2 = '';
        scope.tag3 = '';
      }

      scope.showOption = function (x) {
        return (x == scope.option);
      }

      scope.getClass = function(x) {
        return {'search-highlight': (x == scope.option)}
      }
    }
  }
});