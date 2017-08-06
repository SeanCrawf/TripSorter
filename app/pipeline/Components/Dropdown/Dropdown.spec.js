
describe('Component: Dropdown', function() {

    var $scope, controller;

    beforeEach(function(){
        module(App.name);

        inject(function($rootScope, $compile) {
            var el = angular.element("<div dropdown name=\"from\"  model=\"model.from\"></div>");

            var newScope = $rootScope.$new();
            newScope.model = {from:''};
            $compile(el)(newScope);
            $rootScope.$digest();

            controller = el.controller("dropdown");
        });
    });

    it('should exist', function() {
        expect(controller).toBeTruthy();
    });

});
