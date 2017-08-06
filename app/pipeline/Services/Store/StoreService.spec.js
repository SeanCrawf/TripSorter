
describe('Service: Store', function() {

    var _store, _flux;
    var event_triggered = false;

    beforeEach(function(){
        module(App.name);

        inject(function($store, $flux) {
            _store = $store;
            _flux = $flux;

            _flux.subscribe({
                type: Store.Events.UPDATE,
                action: function(){
                    event_triggered = true;
                }
            });

            //Set initial value for 'city'
            _flux.dispatch({
                type: Store.Events.SET,
                payload: {
                    key: 'city',
                    value: 'Dublin'
                }
            });
        });


    });

    it('should exist', function() {
        expect(_store).toBeTruthy();
    });

    describe('get()', function() {

        it('should return the correct data stored under a given key', function() {
            expect(_store.get('city')).toEqual('Dublin');
        });
        it('should return undefined for an unknown key', function() {
            expect(_store.get('name')).toBeUndefined();
        });

    });

    describe('_set() via Flux Event', function() {

        it('should update the data for a given key', function() {
            expect(_store.get('city')).toEqual('Dublin');
        });

        it('should dispatch a store update event', function() {
            expect(event_triggered).toBeTruthy();
        });

    });

});
