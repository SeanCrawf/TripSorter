///<reference path="Dispatcher.ts"/>

module Flux {

    export interface IEvent {
        type: string,
        payload: any
    }

    export interface IAction {
        type: string,
        action: Function
    }

    export interface IDispatcherFunc {
        (): Flux.Dispatcher;
    }

}
