angular.module('faq', []).config( [
  '$routeProvider',
  function($routeProvider )
  {   
    $routeProvider.when('/', {
      controller: 'faqController'
    })
  }
]);
