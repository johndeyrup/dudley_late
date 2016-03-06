'use strict';

/**
 * @ngdoc function
 * @name dudleyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dudleyApp
 */
angular.module('dudleyApp')
  .controller('MainCtrl', function ($scope, $http) {

  	//Check if trnasportation should arrive on time right before school starts
  	function expected_before_cutoff(expected_time) {
  		var school_start = new Date();
  		//School start is set to 8:30:00 pm today
    	school_start.setHours(10,32,0);
    	var sch_dept = expected_time.sch_dep_dt;
    	var pred_dept = expected_time.pre_dt;
		var sch_date = new Date(sch_dept*1000);
		var pred_date = new Date(pred_dept*1000);
		console.log(school_start, sch_date, pred_date);
		//If the train was scheduled to get to the station before school starts, but is late you now have the time from when the train arrives
		//- school start time to get to school
    	if(sch_dept*1000 <= school_start.getTime() && pred_dept*1000 > school_start.getTime()) {
    		return how_late(expected_time);
    		// return true;
    	}
    	// else {
    	// 	return false;
    	// }
    	// return cut_off.getTime() >= expected_time.getTime();
  	}

  	function how_late(stop) {
  		if(stop.sch_dep_dt < stop.pre_dt) {
    			return [Math.floor((stop.pre_dt - stop.sch_dep_dt)/60), (stop.pre_dt - stop.sch_dep_dt)%60];
		}
  	}

  	function get_valid_stops(trips, stop) {
  		var valid_stops = [];
	   	var i;
    	for(i = 0; i < trips.length; i++) {
    		var j;
    		for(j = 0; j<trips[i].stop.length; j++) {
	  			if(trips[i].stop[j].stop_name === stop) {
					valid_stops.push(trips[i].stop[j]);
  				}
  			}
    	}
    	return valid_stops

  	}

    $http.get("http://realtime.mbta.com/developer/api/v2/predictionsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=Red&format=json")
    .then(function(response) {
    	var bus_schedule = response.data;
    	//Gets inbound bus [1], use [0] for outbound
    	var available_buses = bus_schedule.direction[1].trip;
    	//Gets all trains that stop at given stop
    	$scope.line = "Harvard - Outbound";
    	$scope.grace_times = [];
    	var valid_stops = get_valid_stops(available_buses, $scope.line);
    	//Determines if bus late
    	var i;
    	for(i=0; i<valid_stops.length; i++) {
    		//If scheduled departure time is earlier than predicted then the train was late
    		var temp_grace = expected_before_cutoff(valid_stops[i])
    		if(temp_grace != null){
    			console.log(temp_grace);
    			$scope.grace_times.push(temp_grace);
    		};
    	}
 
    	$scope.grace_times.sort(function(a,b) {
    		return a[0] > b[0];
    	});
    	if($scope.grace_times.length != 0){
    		var shortest_grace = $scope.grace_times[0];
	    	var longest_grace = $scope.grace_times.pop()
	    	$scope.grace = `${shortest_grace[0]} minutes ${shortest_grace[1]} seconds - ${longest_grace[0]}  minutes ${longest_grace[1]} seconds`;
    	}
    	
    	//Get outbound buses
    	// var trips = bus_schedule.direction[0].trip;
    	// $scope.available_buses = [];
    	// var i;
    	// //Iterate over each trips
    	// for(i=0; i < trips.length; i++){
    	// 	//parse date to EST and separate times at the 5th stop
    	// 	var date = moment.utc(parseInt(trips[i].stop[5].sch_dep_dt)*1000).local().format("HH:mm");
    	// 	var hour = date.slice(0,2);
    	// 	var minutes = date.slice(3);
    	// 	//select buses that get to a location before 5 pm
    	// 	if(parseInt(hour) < 17){
    	// 		$scope.available_buses.push(trips[i]);
    	// 	}
    		

    	// }
    	// 	console.log($scope.available_buses);
    })
  });
