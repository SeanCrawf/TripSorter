angular.module(App.name).run(["$templateCache", function($templateCache) {

  'use strict';

  $templateCache.put('pipeline/Components/Dropdown/Dropdown.html',
    "<div class=\"form-group\"> <select class=\"form-control\" name=\"{{ name }}\" ng-model=\"model\" ng-change=\"controller.storeValue()\"> <option value=\"\" hidden>{{ options.length > 0 ? placeholder : 'Loading...' }}</option> <option value=\"{{ option }}\" ng-repeat=\"option in options\">{{ option }}</option> </select> </div>"
  );


  $templateCache.put('pipeline/Components/UIMessage/UIMessage.html',
    "<div class=\"ui-message-container\"> <div class=\"alert alert-danger\" ng-class=\"{ 'active': msgObj.life > 1000 }\" ng-repeat=\"msgObj in messages\"> {{ msgObj.message }} </div> </div>"
  );


  $templateCache.put('pipeline/Routes/TripForm/TripForm.html',
    "<div ng-controller=\"Routes.TripFormController\"> <div ng-form name=\"tripsorter\"> <div dropdown name=\"from\" placeholder=\"From\" store-key=\"cities\" model=\"model.from\"></div> <div dropdown name=\"to\" placeholder=\"To\" store-key=\"cities\" model=\"model.to\"></div> <div class=\"form-group\"> <div class=\"btn-group btn-group-justified\"> <div class=\"btn btn-default\" ng-repeat=\"(key, searchType) in searchTypes\" ng-class=\"{ 'btn-info': currentSearchType === key }\" ng-click=\"controller.setSearchType(key)\">{{ key }}</div> </div> </div> <div class=\"form-group\"> <button class=\"btn btn-success btn-block\" ng-click=\"controller.searchRoute()\"><i class=\"glyphicon glyphicon-search\"></i> Search</button> </div> </div> </div>"
  );


  $templateCache.put('pipeline/Routes/TripFormResults/TripFormResults.html',
    "<div ng-controller=\"Routes.TripFormResultsController\"> <div class=\"bg-info v-margin\" ng-repeat=\"deal in deals\"> <div class=\"col-xs-12 col-spacing\"> <table style=\"width: 100%\"> <tr> <td> <div class=\"margin-bottom\">{{ deal.departure }} <i class=\"glyphicon glyphicon-chevron-right\"></i> {{ deal.arrival }}</div> <div class=\"margin-bottom\"><span class=\"label label-default\">{{ deal.transport }}</span> <small>{{ deal.reference }} for {{ deal.duration.h }}hrs {{ deal.duration.m }}mins</small></div> </td> <td class=\"text-right\"> <div> <span class=\"h4 no-margin\"><strong>&euro;{{ deal.costAfterDiscount }}</strong> </span></div> <div ng-show=\"deal.cost > deal.costAfterDiscount\"> <small class=\"text-danger\"><s>&euro;{{ deal.cost }}</s></small> </div> </td> </tr> </table> </div> <div class=\"clearfix\"></div> </div> <div class=\"bg-primary v-margin margin-bottom-lg\"> <div class=\"col-xs-12 col-spacing text-center\"> <table style=\"width: 100%\"> <tr> <td class=\"text-left\">Total</td> <td class=\"text-center\">{{ duration.h }}hrs {{ duration.m }}mins</td> <td class=\"text-right h3\"><strong>&euro; {{ total }}</strong></td> </tr> </table> </div> <div class=\"clearfix\"></div> </div> <div class=\"form-group\"> <button class=\"btn btn-success btn-block\" ng-click=\"controller.reset()\"><i class=\"glyphicon glyphicon-retweet\"></i> Reset</button> </div> </div>"
  );


}]);