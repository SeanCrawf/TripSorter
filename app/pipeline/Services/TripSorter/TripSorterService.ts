///<reference path="../Store/StoreService.ts"/>
///<reference path="City.ts"/>

module TripSorter {
    "use strict";

    interface IJourneyNode {
        route: string[];    // City names
        total: number;      // Sum of unit for comparison (i.e. price/time)
        deals: string[];    // Deal unique references
    }

    interface IError {
        message: string;
    }

    export var Keys = {
        RESULTS: 'tripsorter_results'
    };

    export class TripSorterService {

        private _cities: {}; // List of cities, indexed by City name
        private _deals: {}; // List of deals, indexed by Deal reference code

        constructor(private $http, private $flux) {
            this._cities = {};
            this._deals = {};
            this._loadFromJson();
        }

        //Get
        public get cities(): {} {
            return this._cities;
        }
        public get deals(): {} {
            return this._deals;
        }

        /**
         * Load the JSON data using $http service
         */
        private _loadFromJson(): void {
            this.$http({
                    method: 'GET',
                    url: 'api/response.json'
                })
                .then((response) => {
                    this.addCitiesAndDeals(response);

                    this.$flux.dispatch({
                        type: Store.Events.SET,
                        payload: {
                            key: 'cities',
                            value: _.sortBy(Object.keys(this._cities), (name) => name) // Sort alphabetically
                        }
                    });
                });
        }

        /**
         * Parses the Cities/Deals from the JSON data
         * @param response - XMLHttpRequest response
         */
        public addCitiesAndDeals(response): void {
            response.data.deals.forEach((deal) => {
                /**
                 * Add both departure and arrival Cities to this._cities(if they don't alread exist),
                 * using the City names as key, for quick access.
                 */
                if(!this.cityExists(deal.departure)){
                    this._cities[deal.departure] = new City(deal.departure);
                }
                if(!this.cityExists(deal.arrival)){
                    this._cities[deal.arrival] = new City(deal.arrival);
                }

                /**
                 * -> Add Deal to City so the connecting journeys can be retrieved by City
                 * -> Add Deal to this._deals Object, using the unique reference as the key
                 */
                this._cities[deal.departure].addDeal(deal.reference, deal);
                this._deals[deal.reference] = new Deal(deal);
            });
        }

        /**
         * Checks if a City exists in the current City list.(this._cities)
         * @param cityName {string} - A City name
         * @return {boolean}
         */
        public cityExists(cityName): boolean {
            return typeof this._cities[cityName] !== 'undefined';
        }

        /**
         * Searches for the shortest path between two Cities.
         * @param departure {string} - A City name
         * @param arrival {string} - A City name
         * @param compare {string} - A value/variable to compare
         * @return {IJourney}
         */
        public shortestPath(departure: string, arrival: string, compare: string): IJourneyNode | IError {

            // Initial checks to validate City names
            if(!this.cityExists(departure)) return this._makeError('The departure City does not exist!');
            if(!this.cityExists(arrival)) return this._makeError('The arrival City does not exist!');

            /**
             * journeyNodes    These contain a snapshot of a journey.
             *  -> Route: A list of Cities the journey has passed through
             *  -> Deal: A list of the Deal the journey has used
             *  -> Total: The total of the filter value for the journey
             */
            var journeyNodes: IJourneyNode[] = this._createJourneyNodes(null, compare, departure);

            // criteraMet    Used to control the while loop
            var criteraMet: boolean = false;

            // Keep searching through City/Deal nodes
            while(!criteraMet){
                // Get the Journey Node with the lowest total value
                var lowestTotalJourney = this._getLowestTotalJourney(journeyNodes);
                /**
                 * The search is successful when:
                 *  -> the first item in route[] is the departure City
                 *  -> the last item in route[] is the arrival City
                 */
                if(lowestTotalJourney.route[0] == departure && lowestTotalJourney.route[lowestTotalJourney.route.length - 1] == arrival ){
                    criteraMet = true;
                    return lowestTotalJourney;
                } else {
                    // Get all the possible next step JourneyNodes for the current JourneyNode
                    this._createJourneyNodes(lowestTotalJourney, compare).forEach((journey) => {
                        journeyNodes.push(journey);
                    });

                    // Once all new JourneyNodes have been added remove their origin.
                    journeyNodes.splice(journeyNodes.indexOf(lowestTotalJourney), 1);

                    // If the there are no more JourneyNodes, we are out of route options.
                    if(journeyNodes.length == 0){
                        criteraMet = true;
                        return this._makeError('No routes meet your search criteria!');
                    }
                }
            }
        }

        /**
         * Use Deal info to create the next possible nodes in the current Journeys
         * @param parentJourney {IJourneyNode} - A City name
         * @param compare {string} - A value/variable to compare
         * @param origin {string} - A City name
         * @return {IJourneyNode[]}
         */
        private _createJourneyNodes(parentJourney: IJourneyNode = null, compare: string, origin: string = null): IJourneyNode[] {

            var journeys = []; // The next set of City nodes are added here.
            var cityName = (parentJourney === null) ? origin : parentJourney.route[parentJourney.route.length - 1];

            for(var i in this._cities[cityName].deals) {
                var deal = this._cities[cityName].deals[i];

                // Start new / continue from last IJourney
                var route = (parentJourney !== null) ? _.clone(parentJourney.route) : [];
                var deals = (parentJourney !== null) ? _.clone(parentJourney.deals) : [];
                var total = (parentJourney !== null) ? _.clone(parentJourney.total) : 0;

                if(origin !== null && route.length == 0){
                    route.push(origin);
                }

                // If City hasn't been visited already, continue.
                if(route.indexOf(deal.arrival) === -1) {

                    // Add next City, the Deal needed to get there and add the Deal value to the total.
                    route.push(deal.arrival);
                    deals.push(deal.reference);
                    total += this._deals[deal.reference][compare];

                    journeys.push({ route: route, deals: deals, total: total });
                }
            }

            return journeys;
        }

        /**
         * Get the journey node with the lowest current total
         * @param journeyNodes {IJourneyNode[]} - The current active list of journey nodes
         * @return {IJourneyNode}
         */
        private _getLowestTotalJourney(journeyNodes:IJourneyNode[] = []): IJourneyNode {
            var lowest;
            for(var i = 0; i < journeyNodes.length; i++){
                if(typeof lowest === 'undefined' || journeyNodes[i].total < lowest.total){
                    lowest = journeyNodes[i];
                }
            }
            return lowest;
        }

        /**
         * Create an error object
         * @param message {string} - Error message
         * @return {IError}
         */
        private _makeError(message: string): IError {
            return {
                message: message
            };
        }

    }

    angular.module(App.name)
        .factory('$tripSorter', [
            '$http', '$flux',
            ($http, $flux) => new TripSorterService($http, $flux)
        ]);
}
