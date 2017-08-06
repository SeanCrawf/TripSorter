
///<reference path="UIMessageController.ts"/>

module App.Components.UIMessage {
    "use strict";

    angular.module(App.name)
        .directive('uiMessage', function() {
            return {
                replace: true,
                transclude: true,
                templateUrl: 'pipeline/Components/UIMessage/UIMessage.html',
                scope: {

                },
                controller: UIMessageControllerExport
            };
        });
}
