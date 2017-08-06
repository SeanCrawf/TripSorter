
describe('Service: TripSorter', function() {

    var tripsorter, cheapest, fastest;

    beforeEach(function(){
        module(App.name);

        inject(function($tripSorter) {
            tripsorter = $tripSorter;
            tripsorter.addCitiesAndDeals({
                data:{
                    deals: [{
                        transport: "train", 
                        departure: "London",
                        arrival: "Amsterdam",
                        duration: { h: "03", m: "30" },
                        cost: 160,
                        discount: 50,
                        reference: "TLA0330"
                    },
                    {
                        transport: "bus", 
                        departure: "London",
                        arrival: "Amsterdam",
                        duration: { h: "9", m: "30" },
                        cost: 40,
                        discount: 50,
                        reference: "BLA0930"
                    }]
                }
            });

            cheapest = tripsorter.shortestPath('London', 'Amsterdam', 'costAfterDiscount');
            fastest = tripsorter.shortestPath('London', 'Amsterdam', 'durationInMins');
        });
    });

    it('should exist', function() {
        expect(tripsorter).toBeTruthy();
    });

    describe('cityExists()', function() {

        it('should return true for a City that exists', function() {
            expect(tripsorter.cityExists('London')).toBeTruthy();
        });

        it('should return false for a City that doesnt exist', function() {
            expect(tripsorter.cityExists('Mars')).toBeFalsy();
        });

    });

    describe('shortestPath()', function() {



        it('should return the cheapest journey, using costAfterDiscount', function() {
            expect(cheapest.deals[0]).toEqual('BLA0930');
        });

        it('should return the fastest journey, using durationInMins', function() {
            expect(fastest.deals[0]).toEqual('TLA0330');
        });

    });

});
