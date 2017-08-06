///<reference path="../Application.ts"/>

namespace App.Routes {

    export class RouteController {

        constructor(protected $scope, protected $flux, protected $location) {
            this.$scope.controller = this;
        }

    }

    angular.module(App.name)
        .controller('Routes.RouteController', [
            '$scope', '$flux', '$location',
            ($scope, $flux, $location) => new RouteController($scope, $flux, $location)
        ]);
}
