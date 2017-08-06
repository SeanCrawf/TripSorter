///<reference path="../RouteController.ts"/>
///<reference path="../../Services/Store/StoreService.ts"/>
///<reference path="../../Services/TripSorter/TripSorterService.ts"/>

namespace App.Routes.TripForm {

    export class TripFormController extends RouteController {

        /**
         * Defines the available search types.
         * @var unit {string}       A numeric Deal object attribute
         * @var active {boolean}    Used to set the initial active search type.
         */
        private _searchTypes: {} = {
                'Cheapest': {
                    unit: 'costAfterDiscount',
                    active: true
                },
                'Fastest': {
                    unit: 'durationInMins'
                }
            };

        constructor($scope, $flux, $location, private $store, private $tripSorter) {
            super($scope, $flux, $location);
            this.$scope.controller = this;
            this.$scope.model = {};
            this.$scope.searchTypes = this._searchTypes;

            // Gets the search type from the store if it exists
            this.$scope.currentSearchType = (this.$store.get('search_type') || false);

            // Sets the first active search type
            if(!this.$scope.currentSearchType){
                for(var s in this._searchTypes){
                    this._searchTypes[s].active && this.setSearchType(s);
                }
            }
        }

        /**
         * Set the search type. (e.g. 'Cheapest')
         */
        public setSearchType(searchType: string): void {
            if(typeof this._searchTypes[searchType] !== 'undefined'){
                this.$scope.currentSearchType = searchType;

                // Send the search type to the Store.
                this.$flux.dispatch({
                    type: Store.Events.SET,
                    payload: { key: 'search_type', value: searchType }
                });
            }
        }

        /**
         * Calculate a path between 2 cities depending on a Deal unit value.
         */
        public searchRoute(): void {
            var from = this.$scope.model.from,
                to = this.$scope.model.to,
                unit = this._searchTypes[this.$scope.currentSearchType].unit;

            if(from === null || from === '' || to === null || to === ''){
                this.$flux.dispatch({
                    type: App.Globals.Events.ERROR_LOG,
                    payload: 'Please select both a city you wish to depart from and a destination!'
                });
                return;
            }else if(from === to){
                this.$flux.dispatch({
                    type: App.Globals.Events.ERROR_LOG,
                    payload: 'The city you wish to depart from must be different than the destination!'
                });
                return;
            }

            // Get the route (if there is a possible route)
            var results = this.$tripSorter.shortestPath(from, to, unit);

            // Send results to the Store.
            this.$flux.dispatch({
                type: Store.Events.SET,
                payload: {
                    key: TripSorter.Keys.RESULTS,
                    value: results
                }
            });

            // A path exists when the Journey has at least 1 Deal.
            if(!!results.deals && results.deals.length > 0){
                this.$location.path('/results');
            } else {

                // If no path is found, dispatch an error message.
                // To be picked up by the UI.
                this.$flux.dispatch({
                    type: App.Globals.Events.ERROR_LOG,
                    payload: results.message
                });
            }

        }

    }

    angular.module(App.name)
        .controller('Routes.TripFormController', [
            '$scope', '$flux', '$location', '$store', '$tripSorter',
            ($scope, $flux, $location, $store, $tripSorter) => new TripFormController($scope, $flux, $location, $store, $tripSorter)
        ]);
}
