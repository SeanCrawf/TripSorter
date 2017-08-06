
describe('Component: UIMessage', function() {

    var $scope, controller;

    beforeEach(function(){
        module(App.name);

        inject(function($rootScope, $compile) {
            var el = angular.element("<div ui-message></div>");

            $compile(el)($rootScope.$new());
            $rootScope.$digest();

            controller = el.controller("uiMessage");
        });
    });

    it('should exist', function() {
        expect(controller).toBeTruthy();
    });

});
