'use strict';

/**
 * @ngdoc function
 * @name dudleyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dudleyApp
 */
angular.module('dudleyApp')
  .controller('AboutCtrl', function ($scope, $http) {
  	$scope.route_array = [];
    var api = "http://realtime.mbta.com/developer/api/v2/"
    var api_key = "api_key=wX9NwuHnZU2ToO7GmGR9uw"
    $http.get(api + "routes?" + api_key + "&format=json")
    .then(function(response) {
    	var routes = response.data.mode;
    	var mode;











	    for (mode of routes) {
    		var route;
    		for (route of mode.route){
    			$scope.route_array.push({mode: mode.mode_name, route_id : route.route_id, route_name : route.route_name});
    		}
    	}
    })
    $scope.modes = ["Subway", "Commuter Rail", "Bus", "Boat"];
    $scope.directions = ["Inbound", "Outbound"];
    
     $scope.form = {};

     $scope.submit = function() {
		 
     	//console.log($scope.form);
		console.log($scope.form.destination);
		var schoolStop = $scope.form.destination;
		$http
		.post("https://maps.googleapis.com/maps/api/directions/json?origin=" + schoolStop + "&destination=906%20Albany%20St,%20Boston,%20MA%2002119&&mode=walking&key=AIzaSyCj9eb9jWocUR9DIrXbahBui3xp8kErwn0")
		.then(function(response) {
			var data = (response.data);
			var routes = data.routes;
			
			for(var route in routes)
			{
				var legs = routes[route].legs;
				
				for(var leg in legs)
				{
					console.log(legs[leg].duration.text);					
				}			
			}
			//console.log(response.data);
		});
		
     	//$http
    // 	.post("https://myserver.com", )

     };
  });
