
module Store {
    "use strict";

    export interface IStoreData {
        key: string;
        value: any;
    }

    export const Events = {
        SET: 'STORE_SET',
        UPDATE: 'STORE_UPDATE'
    };

    export class StoreService {

        // The main data store of the StoreService
        private _store:{} = {};

        constructor(private $flux) {
            this.$flux.subscribe({
                type: Events.SET,
                action: (storeData) => this._set(storeData)
            });
        }

        /**
         * Stores data and emits an update event.
         * @param storeData {IStoreData}    The Key/Value pair to be stored
         */
        private _set(storeData: IStoreData): void {
            this._store[storeData.key] = storeData.value;
            this.$flux.dispatch({ type: Events.UPDATE, payload: storeData.key });
        }

        /**
         * Direct access to Store data
         * @param key {string}    The index referencing stored data
         */
        public get(key: string): any {
            return this._store[key];
        }

    }

    angular.module(App.name)
        .factory('$store', [
            '$flux',
            ($flux) => new StoreService($flux)
        ]);
}
