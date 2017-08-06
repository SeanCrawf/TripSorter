var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    'use strict';
    App.name = 'TripSorter';
    App.Globals = {
        Events: {
            ERROR_LOG: 'error_log'
        }
    };
    angular
        .element(document)
        .ready(function () { return angular.bootstrap(document, [App.name]); });
    angular
        .module(App.name, ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: 'pipeline/Routes/TripForm/TripForm.html'
            })
                .when('/results', {
                templateUrl: 'pipeline/Routes/TripFormResults/TripFormResults.html'
            });
        }])
        .run(['$store', function ($store) { return null; }]);
})(App || (App = {}));
var Store;
(function (Store) {
    "use strict";
    Store.Events = {
        SET: 'STORE_SET',
        UPDATE: 'STORE_UPDATE'
    };
    var StoreService = (function () {
        function StoreService($flux) {
            var _this = this;
            this.$flux = $flux;
            this._store = {};
            this.$flux.subscribe({
                type: Store.Events.SET,
                action: function (storeData) { return _this._set(storeData); }
            });
        }
        StoreService.prototype._set = function (storeData) {
            this._store[storeData.key] = storeData.value;
            this.$flux.dispatch({ type: Store.Events.UPDATE, payload: storeData.key });
        };
        StoreService.prototype.get = function (key) {
            return this._store[key];
        };
        return StoreService;
    }());
    Store.StoreService = StoreService;
    angular.module(App.name)
        .factory('$store', [
        '$flux',
        function ($flux) { return new StoreService($flux); }
    ]);
})(Store || (Store = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var Dropdown;
        (function (Dropdown) {
            var DropdownController = (function () {
                function DropdownController($scope, $flux, $store) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$flux = $flux;
                    this.$store = $store;
                    this._storePrefix = 'dropdown_';
                    this.$scope.controller = this;
                    this.$scope.options = (this.$store.get(this.$scope.storeKey) || []);
                    this.$scope.model = (this.$store.get(this._storePrefix + this.$scope.name) || null);
                    this.$flux.subscribe({
                        type: Store.Events.UPDATE,
                        action: function (key) { return key === _this.$scope.storeKey && _this._getFromStore(); }
                    });
                }
                DropdownController.prototype._getFromStore = function () {
                    this.$scope.options = this.$store.get(this.$scope.storeKey);
                };
                DropdownController.prototype.storeValue = function () {
                    this.$flux.dispatch({
                        type: Store.Events.SET,
                        payload: {
                            key: this._storePrefix + this.$scope.name,
                            value: this.$scope.model
                        }
                    });
                };
                return DropdownController;
            }());
            Dropdown.DropdownController = DropdownController;
            Dropdown.DropdownControllerExport = [
                '$scope', '$flux', '$store',
                function ($scope, $flux, $store) { return new DropdownController($scope, $flux, $store); }
            ];
        })(Dropdown = Components.Dropdown || (Components.Dropdown = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var Dropdown;
        (function (Dropdown) {
            "use strict";
            angular.module(App.name)
                .directive('dropdown', function () {
                return {
                    replace: true,
                    templateUrl: 'pipeline/Components/Dropdown/Dropdown.html',
                    scope: {
                        name: '@',
                        storeKey: '@',
                        placeholder: '@',
                        model: '='
                    },
                    controller: Dropdown.DropdownControllerExport
                };
            });
        })(Dropdown = Components.Dropdown || (Components.Dropdown = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var UIMessage;
        (function (UIMessage) {
            var UIMessageController = (function () {
                function UIMessageController($scope, $flux, $timeout) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$flux = $flux;
                    this.$timeout = $timeout;
                    this._lifeTick = 500;
                    this.$scope.controller = this;
                    this.$scope.messages = [];
                    this.$flux.subscribe({
                        type: App.Globals.Events.ERROR_LOG,
                        action: function (msg) { return _this.addMessage(msg); }
                    });
                }
                UIMessageController.prototype.lifeTicks = function () {
                    var _this = this;
                    var remaining = [];
                    this.$scope.ticking = true;
                    this.$scope.messages.forEach(function (msg) {
                        msg.life -= _this._lifeTick;
                        if (msg.life > 0) {
                            remaining.push(msg);
                        }
                    });
                    this.$scope.messages = remaining;
                    if (this.$scope.messages.length > 0) {
                        this.$timeout(function () { return _this.lifeTicks(); }, this._lifeTick);
                    }
                    else {
                        this.$scope.ticking = false;
                    }
                };
                UIMessageController.prototype._messageExists = function (message) {
                    for (var i = 0; i < this.$scope.messages.length; i++) {
                        if (this.$scope.messages[i].message == message) {
                            return true;
                        }
                    }
                    return false;
                };
                UIMessageController.prototype.addMessage = function (msg, type) {
                    if (type === void 0) { type = 'danger'; }
                    var newMsgObj = {
                        message: msg,
                        life: 6000,
                        type: type
                    };
                    !this._messageExists(msg) && this.$scope.messages.push(newMsgObj);
                    if (!this.$scope.ticking) {
                        this.lifeTicks();
                    }
                };
                return UIMessageController;
            }());
            UIMessage.UIMessageController = UIMessageController;
            UIMessage.UIMessageControllerExport = [
                '$scope', '$flux', '$timeout',
                function ($scope, $flux, $timeout) { return new UIMessageController($scope, $flux, $timeout); }
            ];
        })(UIMessage = Components.UIMessage || (Components.UIMessage = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var UIMessage;
        (function (UIMessage) {
            "use strict";
            angular.module(App.name)
                .directive('uiMessage', function () {
                return {
                    replace: true,
                    transclude: true,
                    templateUrl: 'pipeline/Components/UIMessage/UIMessage.html',
                    scope: {},
                    controller: UIMessage.UIMessageControllerExport
                };
            });
        })(UIMessage = Components.UIMessage || (Components.UIMessage = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Routes;
    (function (Routes) {
        var RouteController = (function () {
            function RouteController($scope, $flux, $location) {
                this.$scope = $scope;
                this.$flux = $flux;
                this.$location = $location;
                this.$scope.controller = this;
            }
            return RouteController;
        }());
        Routes.RouteController = RouteController;
        angular.module(App.name)
            .controller('Routes.RouteController', [
            '$scope', '$flux', '$location',
            function ($scope, $flux, $location) { return new RouteController($scope, $flux, $location); }
        ]);
    })(Routes = App.Routes || (App.Routes = {}));
})(App || (App = {}));
var TripSorter;
(function (TripSorter) {
    "use strict";
    var Deal = (function () {
        function Deal(deal) {
            this._transport = deal.transport;
            this._arrival = deal.arrival;
            this._departure = deal.departure;
            this._duration = deal.duration;
            this._cost = deal.cost;
            this._discount = deal.discount;
            this._reference = deal.reference;
        }
        Object.defineProperty(Deal.prototype, "transport", {
            get: function () {
                return this._transport;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "arrival", {
            get: function () {
                return this._arrival;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "departure", {
            get: function () {
                return this._departure;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "cost", {
            get: function () {
                return this._cost;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "discount", {
            get: function () {
                return this._discount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "reference", {
            get: function () {
                return this._reference;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "durationInMins", {
            get: function () {
                return (parseInt(this._duration.h) * 60) + parseInt(this._duration.m);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Deal.prototype, "costAfterDiscount", {
            get: function () {
                return parseInt(this._cost * (100 - this._discount) + '') / 100;
            },
            enumerable: true,
            configurable: true
        });
        return Deal;
    }());
    TripSorter.Deal = Deal;
})(TripSorter || (TripSorter = {}));
var TripSorter;
(function (TripSorter) {
    "use strict";
    var City = (function () {
        function City(city) {
            this._name = city.name;
            this._deals = (city.deals || {});
        }
        Object.defineProperty(City.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(City.prototype, "deals", {
            get: function () {
                return this._deals;
            },
            enumerable: true,
            configurable: true
        });
        City.prototype.addDeal = function (arrival, deal) {
            this._deals[arrival] = new TripSorter.Deal(deal);
        };
        return City;
    }());
    TripSorter.City = City;
})(TripSorter || (TripSorter = {}));
var TripSorter;
(function (TripSorter) {
    "use strict";
    TripSorter.Keys = {
        RESULTS: 'tripsorter_results'
    };
    var TripSorterService = (function () {
        function TripSorterService($http, $flux) {
            this.$http = $http;
            this.$flux = $flux;
            this._cities = {};
            this._deals = {};
            this._loadFromJson();
        }
        Object.defineProperty(TripSorterService.prototype, "cities", {
            get: function () {
                return this._cities;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TripSorterService.prototype, "deals", {
            get: function () {
                return this._deals;
            },
            enumerable: true,
            configurable: true
        });
        TripSorterService.prototype._loadFromJson = function () {
            var _this = this;
            this.$http({
                method: 'GET',
                url: 'api/response.json'
            })
                .then(function (response) {
                _this.addCitiesAndDeals(response);
                _this.$flux.dispatch({
                    type: Store.Events.SET,
                    payload: {
                        key: 'cities',
                        value: _.sortBy(Object.keys(_this._cities), function (name) { return name; })
                    }
                });
            });
        };
        TripSorterService.prototype.addCitiesAndDeals = function (response) {
            var _this = this;
            response.data.deals.forEach(function (deal) {
                if (!_this.cityExists(deal.departure)) {
                    _this._cities[deal.departure] = new TripSorter.City(deal.departure);
                }
                if (!_this.cityExists(deal.arrival)) {
                    _this._cities[deal.arrival] = new TripSorter.City(deal.arrival);
                }
                _this._cities[deal.departure].addDeal(deal.reference, deal);
                _this._deals[deal.reference] = new TripSorter.Deal(deal);
            });
        };
        TripSorterService.prototype.cityExists = function (cityName) {
            return typeof this._cities[cityName] !== 'undefined';
        };
        TripSorterService.prototype.shortestPath = function (departure, arrival, compare) {
            if (!this.cityExists(departure))
                return this._makeError('The departure City does not exist!');
            if (!this.cityExists(arrival))
                return this._makeError('The arrival City does not exist!');
            var journeyNodes = this._createJourneyNodes(null, compare, departure);
            var criteraMet = false;
            while (!criteraMet) {
                var lowestTotalJourney = this._getLowestTotalJourney(journeyNodes);
                if (lowestTotalJourney.route[0] == departure && lowestTotalJourney.route[lowestTotalJourney.route.length - 1] == arrival) {
                    criteraMet = true;
                    return lowestTotalJourney;
                }
                else {
                    this._createJourneyNodes(lowestTotalJourney, compare).forEach(function (journey) {
                        journeyNodes.push(journey);
                    });
                    journeyNodes.splice(journeyNodes.indexOf(lowestTotalJourney), 1);
                    if (journeyNodes.length == 0) {
                        criteraMet = true;
                        return this._makeError('No routes meet your search criteria!');
                    }
                }
            }
        };
        TripSorterService.prototype._createJourneyNodes = function (parentJourney, compare, origin) {
            if (parentJourney === void 0) { parentJourney = null; }
            if (origin === void 0) { origin = null; }
            var journeys = [];
            var cityName = (parentJourney === null) ? origin : parentJourney.route[parentJourney.route.length - 1];
            for (var i in this._cities[cityName].deals) {
                var deal = this._cities[cityName].deals[i];
                var route = (parentJourney !== null) ? _.clone(parentJourney.route) : [];
                var deals = (parentJourney !== null) ? _.clone(parentJourney.deals) : [];
                var total = (parentJourney !== null) ? _.clone(parentJourney.total) : 0;
                if (origin !== null && route.length == 0) {
                    route.push(origin);
                }
                if (route.indexOf(deal.arrival) === -1) {
                    route.push(deal.arrival);
                    deals.push(deal.reference);
                    total += this._deals[deal.reference][compare];
                    journeys.push({ route: route, deals: deals, total: total });
                }
            }
            return journeys;
        };
        TripSorterService.prototype._getLowestTotalJourney = function (journeyNodes) {
            if (journeyNodes === void 0) { journeyNodes = []; }
            var lowest;
            for (var i = 0; i < journeyNodes.length; i++) {
                if (typeof lowest === 'undefined' || journeyNodes[i].total < lowest.total) {
                    lowest = journeyNodes[i];
                }
            }
            return lowest;
        };
        TripSorterService.prototype._makeError = function (message) {
            return {
                message: message
            };
        };
        return TripSorterService;
    }());
    TripSorter.TripSorterService = TripSorterService;
    angular.module(App.name)
        .factory('$tripSorter', [
        '$http', '$flux',
        function ($http, $flux) { return new TripSorterService($http, $flux); }
    ]);
})(TripSorter || (TripSorter = {}));
var App;
(function (App) {
    var Routes;
    (function (Routes) {
        var TripForm;
        (function (TripForm) {
            var TripFormController = (function (_super) {
                __extends(TripFormController, _super);
                function TripFormController($scope, $flux, $location, $store, $tripSorter) {
                    var _this = _super.call(this, $scope, $flux, $location) || this;
                    _this.$store = $store;
                    _this.$tripSorter = $tripSorter;
                    _this._searchTypes = {
                        'Cheapest': {
                            unit: 'costAfterDiscount',
                            active: true
                        },
                        'Fastest': {
                            unit: 'durationInMins'
                        }
                    };
                    _this.$scope.controller = _this;
                    _this.$scope.model = {};
                    _this.$scope.searchTypes = _this._searchTypes;
                    _this.$scope.currentSearchType = (_this.$store.get('search_type') || false);
                    if (!_this.$scope.currentSearchType) {
                        for (var s in _this._searchTypes) {
                            _this._searchTypes[s].active && _this.setSearchType(s);
                        }
                    }
                    return _this;
                }
                TripFormController.prototype.setSearchType = function (searchType) {
                    if (typeof this._searchTypes[searchType] !== 'undefined') {
                        this.$scope.currentSearchType = searchType;
                        this.$flux.dispatch({
                            type: Store.Events.SET,
                            payload: { key: 'search_type', value: searchType }
                        });
                    }
                };
                TripFormController.prototype.searchRoute = function () {
                    var from = this.$scope.model.from, to = this.$scope.model.to, unit = this._searchTypes[this.$scope.currentSearchType].unit;
                    if (from === null || from === '' || to === null || to === '') {
                        this.$flux.dispatch({
                            type: App.Globals.Events.ERROR_LOG,
                            payload: 'Please select both a city you wish to depart from and a destination!'
                        });
                        return;
                    }
                    else if (from === to) {
                        this.$flux.dispatch({
                            type: App.Globals.Events.ERROR_LOG,
                            payload: 'The city you wish to depart from must be different than the destination!'
                        });
                        return;
                    }
                    var results = this.$tripSorter.shortestPath(from, to, unit);
                    this.$flux.dispatch({
                        type: Store.Events.SET,
                        payload: {
                            key: TripSorter.Keys.RESULTS,
                            value: results
                        }
                    });
                    if (!!results.deals && results.deals.length > 0) {
                        this.$location.path('/results');
                    }
                    else {
                        this.$flux.dispatch({
                            type: App.Globals.Events.ERROR_LOG,
                            payload: results.message
                        });
                    }
                };
                return TripFormController;
            }(Routes.RouteController));
            TripForm.TripFormController = TripFormController;
            angular.module(App.name)
                .controller('Routes.TripFormController', [
                '$scope', '$flux', '$location', '$store', '$tripSorter',
                function ($scope, $flux, $location, $store, $tripSorter) { return new TripFormController($scope, $flux, $location, $store, $tripSorter); }
            ]);
        })(TripForm = Routes.TripForm || (Routes.TripForm = {}));
    })(Routes = App.Routes || (App.Routes = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Routes;
    (function (Routes) {
        var TripFormResults;
        (function (TripFormResults) {
            var TripFormResultsController = (function (_super) {
                __extends(TripFormResultsController, _super);
                function TripFormResultsController($scope, $flux, $location, $store, $tripSorter) {
                    var _this = _super.call(this, $scope, $flux, $location) || this;
                    _this.$store = $store;
                    _this.$tripSorter = $tripSorter;
                    _this.$scope.controller = _this;
                    _this.$scope.results = (_this.$store.get(TripSorter.Keys.RESULTS) || false);
                    _this._validateResults();
                    return _this;
                }
                TripFormResultsController.prototype._validateResults = function () {
                    if (!this.$scope.results) {
                        this.$location.path('/');
                    }
                    this.$scope.total = 0;
                    this.$scope.duration = { h: 0, m: 0 };
                    this.$scope.deals = [];
                    for (var i in this.$scope.results.deals) {
                        var deal = this.getDeal(this.$scope.results.deals[i]);
                        this.$scope.deals.push(deal);
                        this.$scope.duration.h += parseInt(deal.duration['h']);
                        this.$scope.duration.m += parseInt(deal.duration['m']);
                        this.$scope.total += deal.costAfterDiscount;
                    }
                    this.$scope.duration.h += Math.floor(this.$scope.duration.m / 60);
                    this.$scope.duration.m = this.$scope.duration.m % 60;
                    this.$scope.duration.h = ("0" + this.$scope.duration.h).slice(-2);
                    this.$scope.duration.m = ("0" + this.$scope.duration.m).slice(-2);
                };
                TripFormResultsController.prototype.getDeal = function (reference) {
                    return new TripSorter.Deal(this.$tripSorter.deals[reference]);
                };
                TripFormResultsController.prototype.reset = function () {
                    this.$location.path('/');
                };
                return TripFormResultsController;
            }(Routes.RouteController));
            TripFormResults.TripFormResultsController = TripFormResultsController;
            angular.module(App.name)
                .controller('Routes.TripFormResultsController', [
                '$scope', '$flux', '$location', '$store', '$tripSorter',
                function ($scope, $flux, $location, $store, $tripSorter) { return new TripFormResultsController($scope, $flux, $location, $store, $tripSorter); }
            ]);
        })(TripFormResults = Routes.TripFormResults || (Routes.TripFormResults = {}));
    })(Routes = App.Routes || (App.Routes = {}));
})(App || (App = {}));
var Flux;
(function (Flux) {
    "use strict";
    var Dispatcher = (function () {
        function Dispatcher() {
            this._subscriptions = {};
        }
        Object.defineProperty(Dispatcher.prototype, "subscriptions", {
            get: function () {
                return this._subscriptions;
            },
            enumerable: true,
            configurable: true
        });
        Dispatcher.prototype._dispatch = function (ev) {
            this._subscriptions[ev.type] && this._subscriptions[ev.type].forEach(function (subscription) {
                subscription(ev.payload);
            });
            return this;
        };
        Dispatcher.prototype.dispatch = function (ev) {
            if (ev.constructor !== Array) {
                return this._dispatch(ev);
            }
            else {
                for (var i in ev) {
                    this._dispatch(ev[i]);
                }
                return this;
            }
        };
        Dispatcher.prototype._subscribe = function (act) {
            (this._subscriptions[act.type] = this._subscriptions[act.type] || []).push(act.action);
            return this;
        };
        Dispatcher.prototype.subscribe = function (act) {
            if (act.constructor !== Array) {
                return this._subscribe(act);
            }
            else {
                for (var i in act) {
                    this._subscribe(act[i]);
                }
                return this;
            }
        };
        return Dispatcher;
    }());
    Flux.Dispatcher = Dispatcher;
    angular.module(App.name)
        .factory('$flux', [function () { return new Dispatcher(); }]);
})(Flux || (Flux = {}));
//# sourceMappingURL=app.js.map