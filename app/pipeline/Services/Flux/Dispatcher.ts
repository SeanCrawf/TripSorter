///<reference path="../../Application.ts"/>
///<reference path="Flux.ts"/>

module Flux {
    "use strict";

    export class Dispatcher {

        private _subscriptions = {};

        constructor() { }

        //Get
        get subscriptions():{} {
            return this._subscriptions;
        }

        /**
         * Runs all the registered listeners for a given custom event
         * @param ev     An event object containing type (event type) and payload(data to be passed to listener)
         */
        private _dispatch(ev: IEvent | any): Dispatcher {
            this._subscriptions[ev.type] && this._subscriptions[ev.type].forEach((subscription) => {
                subscription(ev.payload);
            });
            return this;
        }

        /**
         * Runs all the registered listeners for given custom event/s
         * @param ev     Event/s containing type (event type) and payload(data to be passed to listeners)
         */
        public dispatch(ev: IEvent | IEvent[]): Dispatcher {
            if(ev.constructor !== Array){
                return this._dispatch(ev);
            } else {
                for(var i in ev){
                    this._dispatch(ev[i]);
                }
                return this;
            }
        }

        /**
         * Subscribes an action to a custom event
         * @param act     An action object containing event type(event name) and an action function.
         */
        private _subscribe(act:IAction | any): Dispatcher {
            (this._subscriptions[act.type] = this._subscriptions[act.type] || []).push(act.action);
            return this;
        }

        /**
         * Subscribes actions to a custom event
         * @param act     Action object/s containing event type(event name) and an action function.
         */
        public subscribe(act: IAction | IAction[]): Dispatcher {
            if(act.constructor !== Array){
                return this._subscribe(act)
            } else {
                for(var i in act){
                    this._subscribe(act[i]);
                }
                return this;
            }
        }
    }

     angular.module(App.name)
        .factory('$flux', [ () => new Dispatcher() ]);

}
