///<reference path="../../Application.ts"/>
///<reference path="DropdownController.ts"/>

namespace App.Components.Dropdown {
    "use strict";

    angular.module(App.name)
        .directive('dropdown', function() {
            return {
                replace: true,
                templateUrl: 'pipeline/Components/Dropdown/Dropdown.html',
                scope: {
                    name: '@',
                    storeKey: '@',
                    placeholder: '@',
                    model: '='
                },
                controller: DropdownControllerExport
            };
        });
}
