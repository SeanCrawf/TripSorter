describe('Service: Flux', function() {

    var flux, fluxSubscription, fluxDispatch;
    var actions = {
        TEST_ACTION: 'test_action'
    };
    var test_model = { name: '' };
    var change_model = function(data){
        test_model.name = data;
    };

    beforeEach(function(){
        module(App.name);

        inject(function($flux) {
            flux = $flux;
        });
    });

    it('should exist', function() {
        expect(flux).toBeTruthy();
    });

    describe('subscribe()', function() {

        it('should setup a subscription', function() {
            fluxSubscription = flux.subscribe({
                type: actions.TEST_ACTION,
                action: function(data){
                    change_model(data);
                }
            });

            expect(fluxSubscription.subscriptions[actions.TEST_ACTION].length).toBeGreaterThan(0);
        });

    });

    describe('dispatch()', function() {

        it('should trigger the subscriptions action', function() {
            fluxDispatch = fluxSubscription.dispatch({
                type: actions.TEST_ACTION,
                payload: "Sean"
            });

            expect(test_model.name).toEqual('Sean');
        });

    });

});
