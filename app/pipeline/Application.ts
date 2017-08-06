///<reference path="_all.ts"/>

module App {
    'use strict';

    export var name = 'TripSorter';

    export var Globals = {
        Events: {
            ERROR_LOG: 'error_log'
        }
    };

    angular
        .element(document)
        .ready(() => angular.bootstrap(document, [App.name]));

    angular
        .module(App.name, [ 'ngRoute' ])
        .config([ '$routeProvider', ($routeProvider) => {
            //Routes
            $routeProvider
                .when('/', {
                    templateUrl: 'pipeline/Routes/TripForm/TripForm.html'
                })
                .when('/results', {
                    templateUrl: 'pipeline/Routes/TripFormResults/TripFormResults.html'
                });
        }])
        .run([ '$store', ($store) => null ]);
}







