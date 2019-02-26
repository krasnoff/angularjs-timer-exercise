var app = angular.module('app1', ['ngRoute']);

// routing between pages
app.config(function ($routeProvider) {
    $routeProvider
    .when("/page1", {
        templateUrl: 'page1.html', controller: 'page1Ctrl'
    })
    .when("/page2", {
        templateUrl: 'page2.html', controller: 'page2Ctrl'
    })
    .otherwise({ redirectTo: "/page1" });
});

app.controller("page1Ctrl", function ($scope) {
    $scope.msg = "page 1";
});

app.controller("page2Ctrl", function ($scope) {
    $scope.msg = "page 2";

    $scope.range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
});

app.directive('timerCtrl', ['$interval', 'dateFilter', 'myServices', function ($interval, dateFilter, myServices) {
    function link(scope, element, attrs) {
        var timeoutId;
        var innerDate;
    
        function updateTime() {
          element.text(dateFilter(scope.innerDate, 'mm:ss'));
        }
    
        scope.$watch(attrs.myCurrentTime, function(value) {
            myServices.getBugs().then((data, status) => {
                var nums = data.data.split('\n');
                scope.innerDate = new Date(2012, 0, 1, 0, nums[0], nums[1]);
                updateTime();
            });
        });
    
        element.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });
    
        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function() {
            if (scope.innerDate) {
                scope.innerDate.setSeconds(scope.innerDate.getSeconds() + 1);
                updateTime(); // update DOM
            }
        }, 1000);
      }
    
    return {
        restrict: 'E',
        link: link
    };
}]);

app.factory('myServices', function($http) {

    return {
        getBugs: function() {
            return $http.get('https://www.random.org/sequences/?min=1&max=59&col=1&format=plain&rnd=new');
        }
    };
});