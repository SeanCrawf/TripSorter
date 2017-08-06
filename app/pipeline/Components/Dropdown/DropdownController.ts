///<reference path="../../Services/Store/StoreService.ts"/>

namespace App.Components.Dropdown {

	export class DropdownController {

        // This prefix prevents any Store-key conflicts
        private _storePrefix: string = 'dropdown_';

		constructor(private $scope, private $flux, private $store) {
			this.$scope.controller = this;

            // Attempts to retrieve any existing Store data
            this.$scope.options = (this.$store.get(this.$scope.storeKey) || []);
            this.$scope.model = (this.$store.get(this._storePrefix + this.$scope.name) || null);

            // Listens for Store updates
            this.$flux.subscribe({
                type: Store.Events.UPDATE,
                action: (key) => key === this.$scope.storeKey && this._getFromStore()
            });
		}

        /**
         * Pull latest Store data
         */
        private _getFromStore(): void {
            this.$scope.options = this.$store.get(this.$scope.storeKey);
        }

        /**
         * Pushes the current value of the dropdown to the store.
         * Allows the state to be restored.
         */
        public storeValue(): void {
            this.$flux.dispatch({
                type: Store.Events.SET,
                payload: {
                    key: this._storePrefix + this.$scope.name,
                    value: this.$scope.model
                }
            });
        }

	}

    export var DropdownControllerExport: any[] = [
        '$scope', '$flux', '$store',
        ($scope, $flux, $store) => new DropdownController($scope, $flux, $store)
    ];
}
