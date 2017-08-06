///<reference path="../../Application.ts"/>

namespace App.Components.UIMessage {

    interface UIMessage {
        life: number;
        message: string;
        type: string;
    }

	export class UIMessageController {

        //How often the timeout will run
        private _lifeTick:number = 500;

		constructor(private $scope, private $flux, private $timeout) {
			this.$scope.controller = this;
            this.$scope.messages = [];

            this.$flux.subscribe({
                type: App.Globals.Events.ERROR_LOG,
                action: (msg) => this.addMessage(msg)
            });
		}

        /**
         * Loops through all on screen messages and counts down their lives.
         * If the life depletes to 0, the message is removed.
         */
        private lifeTicks(): void {
            var remaining = [];
            this.$scope.ticking = true;

            this.$scope.messages.forEach((msg) => {
                msg.life -= this._lifeTick;
                if(msg.life > 0){
                    remaining.push(msg);
                }
            });
            this.$scope.messages = remaining;

            if(this.$scope.messages.length > 0){
                this.$timeout(() => this.lifeTicks(), this._lifeTick);
            } else {
                this.$scope.ticking = false;
            }

        }

        /**
         * Checks if a specific message already exists on the screen
         */
        private _messageExists(message): boolean {
            for(var i = 0; i < this.$scope.messages.length; i++){
                if(this.$scope.messages[i].message == message){
                    return true;
                }
            }
            return false;
        }

        /**
         * Adds a new message
         */
        public addMessage(msg: string, type: string = 'danger'): void {
            var newMsgObj: UIMessage = {
                message: msg,
                life: 6000, // This message will only exist for 6 secs
                type: type
            };

            !this._messageExists(msg) && this.$scope.messages.push(newMsgObj);

            if(!this.$scope.ticking){
                this.lifeTicks();
            }
        }

	}

    export var UIMessageControllerExport: any[] = [
        '$scope', '$flux', '$timeout',
        ($scope, $flux, $timeout) => new UIMessageController($scope, $flux, $timeout)
    ];
}
