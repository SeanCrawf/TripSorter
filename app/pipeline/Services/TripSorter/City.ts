///<reference path="Deal.ts"/>

module TripSorter {
    "use strict";

    interface ICity {
        name: string;
        deals?: {};
    }

    export class City {

        private _name: string;
        private _deals: {};

        constructor(city: ICity){
            this._name = city.name;
            this._deals = (city.deals || {});
        }

        //Get
        public get name(): string {
            return this._name;
        }
        public get deals(): {} {
            return this._deals;
        }

        /**
         * Adds a Deal to a city. These are used to create the next step in a Journey.
         * @param arrival {string}    The destination reached in the Deal
         * @param deal {IDeal}        The Deal data
         */
        public addDeal(arrival: string, deal: IDeal): void {
            this._deals[arrival] = new Deal(deal);
        }

    }
}
