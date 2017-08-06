///<reference path="../RouteController.ts"/>
///<reference path="../../Services/Store/StoreService.ts"/>
///<reference path="../../Services/TripSorter/TripSorterService.ts"/>

namespace App.Routes.TripFormResults {

	export class TripFormResultsController extends RouteController {

		constructor($scope, $flux, $location, private $store, private $tripSorter) {
            super($scope, $flux, $location);
			this.$scope.controller = this;
            // Attempts to retrieve the results data from the Store
            this.$scope.results = (this.$store.get(TripSorter.Keys.RESULTS) || false);
            this._validateResults();
		}

        private _validateResults(): void {
            if(!this.$scope.results){
                // If results are no good, redirect to search box.
                this.$location.path('/');
            }

            this.$scope.total = 0;
            this.$scope.duration = { h: 0, m: 0 };
            this.$scope.deals = [];
            for(var i in this.$scope.results.deals){
                var deal = this.getDeal(this.$scope.results.deals[i]);
                this.$scope.deals.push(deal);

                this.$scope.duration.h += parseInt(deal.duration['h']);
                this.$scope.duration.m += parseInt(deal.duration['m']);
                this.$scope.total += deal.costAfterDiscount;
            }

            this.$scope.duration.h += Math.floor(this.$scope.duration.m/60);
            this.$scope.duration.m = this.$scope.duration.m % 60;

            this.$scope.duration.h = ("0" + this.$scope.duration.h).slice(-2);
            this.$scope.duration.m = ("0" + this.$scope.duration.m).slice(-2);
        }

        /**
         * Gets the Deal object from
         * @param reference {string}    The unique Deal reference code
         */
        public getDeal(reference:string): TripSorter.Deal {
            return new TripSorter.Deal(this.$tripSorter.deals[reference]);
        }

        /**
         * Directs the user back to the search form
         */
        public reset(): void {
            this.$location.path('/');
        }

	}

    angular.module(App.name)
        .controller('Routes.TripFormResultsController', [
	        '$scope', '$flux', '$location', '$store', '$tripSorter',
	        ($scope, $flux, $location, $store, $tripSorter) => new TripFormResultsController($scope, $flux, $location, $store, $tripSorter)
	    ]);
}
