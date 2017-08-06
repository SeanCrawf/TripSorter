module TripSorter {
    "use strict";

    interface IDuration { h: string; m: string; }

    export interface IDeal {
        transport: string;
        arrival: string;
        departure: string;
        duration: IDuration;
        cost: number;
        discount: number;
        reference: string;
    }

    export class Deal {

        private _transport: string;
        private _arrival: string;
        private _departure: string;
        private _duration: IDuration;
        private _cost: number;
        private _discount: number;
        private _reference: string;

        constructor(deal: IDeal){
            this._transport = deal.transport;
            this._arrival = deal.arrival;
            this._departure = deal.departure;
            this._duration = deal.duration;
            this._cost = deal.cost;
            this._discount = deal.discount;
            this._reference = deal.reference;
        }

        //Get
        public get transport(): string {
            return this._transport;
        }
        public get arrival(): string {
            return this._arrival;
        }
        public get departure(): string {
            return this._departure;
        }
        public get duration(): {} {
            return this._duration;
        }
        public get cost(): {} {
            return this._cost;
        }
        public get discount(): number {
            return this._discount;
        }
        public get reference(): string {
            return this._reference;
        }

        /**
         * Converts hours + minutes to minutes, used to compare Deal journey durations.
         */
        public get durationInMins(): number {
            return (parseInt(this._duration.h) * 60) + parseInt(this._duration.m);
        }

        /**
         * Returns the value of a Deal after the discount has been applied.
         */
        public get costAfterDiscount(): number {
            return parseInt(this._cost * (100 - this._discount) + '')/100;
        }



    }
}
