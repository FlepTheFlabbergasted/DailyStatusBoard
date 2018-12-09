
// https://www.chartjs.org/samples/latest/charts/bar/stacked.html

// Take user input for histogram and append to array/list
// Data consists of nr of + and - as well as date 
	// Update graphicly when pressing +/- ?

// When user presses "commit" update the histogram with added data
// Save the array with data to file/in Chrome

// Add post it notes...

// TODO: Remove, initalialy used when debugging without user input
function random(){
	return Math.ceil(Math.random() * 10 + 1);
}

const DEBUG = true;
function DEBUG_LOG(string) {
	if(DEBUG == true) {
		console.log('[DEBUG] ' + string);
	}
}

// Constants
const MAX_DATA_LENGTH = 10;
const PLUS_DATASET = 0;
const MINUS_DATASET = 1;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// TODO: Remove once figured out how to retreive min/max ticks in chart options
const Y_AXES_TICKS_SUGGESTED_MIN = -5;
const Y_AXES_TICKS_SUGGESTED_MAX = 5;

var LAST_ADDED_DATE = '';

// TODO: Needed? Just input the rgb string directly in the chartData?
window.chartColors = {
	red: 'rgb(220, 20, 60)',
	redOp: 'rgb(220, 20, 60, 0.6)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(34, 175, 34)',
	greenOp: 'rgb(34, 175, 34, 0.6)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

/**
 * Data for the displayed bar chart, this variable is used when updating
 * the chart. Initialy start with no labels and no data that later gets added
 * from user input. 
 */
var chartData = {
	labels: [],
	datasets: [{
		label: 'Plus',
		backgroundColor: window.chartColors.greenOp,//color(window.chartColors.green).alpha(0.5).rgbString(),
		borderColor: window.chartColors.green,
		borderWidth: 1,
		data: []
	}, {
		label: 'Minus',
		backgroundColor: window.chartColors.redOp,
		borderColor: window.chartColors.red,
		borderWidth: 1,
		data: []
	}]
}; // chartData

class ChartHandler {
	constructor() {
		console.log('[INFO] ##### Entering ChartHandler::constructor #####');

		LAST_ADDED_DATE = Cookies.get('Last Added Date');
		let labels = Cookies.getJSON('Labels');
		let plusData = Cookies.getJSON('PlusData');
		let minusData = Cookies.getJSON('MinusData');

		if(plusData != undefined && minusData != undefined) {
			DEBUG_LOG('Initiating chart with previously stored data:\nLabels [' + labels + '], PlusData [' + plusData + '], MinusData [' + minusData + '], Last Added Date: ' +  LAST_ADDED_DATE);
			chartData.labels = labels;
			chartData.datasets[PLUS_DATASET].data = plusData;
			chartData.datasets[MINUS_DATASET].data = minusData;
		}

		var ctx = document.getElementById('canvas').getContext('2d');
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				title: {
					display: false,
					text: 'Daily Status'
				},
				legend: {
					display: false,
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
	    	maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {
							fontSize: 15,
           				}
					}],
					yAxes: [{
						stacked: true,
						ticks: {
							fontSize: 25,
							// TODO: Using const vars since I can't figure out how to access these options
							suggestedMin: Y_AXES_TICKS_SUGGESTED_MIN,
							suggestedMax: Y_AXES_TICKS_SUGGESTED_MAX,
           				}
					}]
				}
			}
		}); // window.chart
	} // constructor

	update() {
		this.chart.update();
	} // update

	addData(nrPlus, nrMinus) {
		console.log('[INFO] ##### Entering ChartHandler::addData #####');
		DEBUG_LOG("User input, Plus: " + nrPlus + " nrMinus: " + nrMinus);

		// Minor fault handling
		if(nrPlus  < Y_AXES_TICKS_SUGGESTED_MIN ||
			 nrPlus  > Y_AXES_TICKS_SUGGESTED_MAX ||
			 nrMinus < Y_AXES_TICKS_SUGGESTED_MIN ||
			 nrMinus > Y_AXES_TICKS_SUGGESTED_MAX) {
			DEBUG_LOG('You are adding values outside the suggested range (min: ' + Y_AXES_TICKS_SUGGESTED_MIN + ', max: ' + Y_AXES_TICKS_SUGGESTED_MAX + ')');
		}

		// We must have any valid data for input to the graph
		if(!nrPlus || !nrMinus) { // Javascript "truthy"
			DEBUG_LOG('No valid input data, returning');
			return;
		} else if(nrPlus == 0 && nrMinus == 0) {
			DEBUG_LOG('No valid input data (nrPlus: 0, nrMinus: 0), returning');
			return;
		} else if(nrPlus < 0 || nrMinus < 0) {
			DEBUG_LOG('No valid input data (nrPlus < 0 or nrMinus < 0), returning');
			return;
		}

		// Only show the latest data inputs
		// Only need to check one dataset since they should both be the same length
		if(chartData.datasets[PLUS_DATASET].data.length >= MAX_DATA_LENGTH) {
			DEBUG_LOG('Dataset data is longer than MAX_DATA_LENGTH (' + MAX_DATA_LENGTH + '), removing first datapoint');
			// Remove the label first
			chartData.labels.shift();
			// Remove the first data point
			chartData.datasets[PLUS_DATASET].data.shift();
			chartData.datasets[MINUS_DATASET].data.shift();
		}

		DEBUG_LOG('Last Added Date: ' + LAST_ADDED_DATE);
		DEBUG_LOG('Label to add: ' + WEEKDAYS[new Date().getDay()]);
		DEBUG_LOG('Plus data  to add: ' + nrPlus);
		DEBUG_LOG('Minus data to add: ' + nrMinus);

		// Overwrite data if adding on the same day (gets date as YYYY-MM-DD)
		if(LAST_ADDED_DATE == new Date().toISOString().slice(0,10)) {
			chartData.labels.pop();
			chartData.datasets[PLUS_DATASET].data.pop();
			chartData.datasets[MINUS_DATASET].data.pop();
			chartData.labels.push(WEEKDAYS[new Date().getDay()]);
			chartData.datasets[PLUS_DATASET].data.push(nrPlus);
			chartData.datasets[MINUS_DATASET].data.push(nrMinus * -1);
		} else {
			LAST_ADDED_DATE = new Date().toISOString().slice(0,10);
			chartData.labels.push(WEEKDAYS[new Date().getDay()]);
			chartData.datasets[PLUS_DATASET].data.push(nrPlus);
			chartData.datasets[MINUS_DATASET].data.push(nrMinus * -1);
		}
		

		// Store Data
		DEBUG_LOG('Storing last added date: ' + LAST_ADDED_DATE);
		DEBUG_LOG('Storing labels: ' + chartData.labels);
		DEBUG_LOG('Storing plus dataset: ' + chartData.datasets[PLUS_DATASET].data);
		DEBUG_LOG('Storing minus dataset: ' + chartData.datasets[MINUS_DATASET].data);
		Cookies.set('Last Added Date', LAST_ADDED_DATE);
		Cookies.set('Labels', chartData.labels);
		Cookies.set('PlusData', chartData.datasets[PLUS_DATASET].data);
		Cookies.set('MinusData', chartData.datasets[MINUS_DATASET].data);		

		this.update();
	} // addData

	clear() {
		chartData.labels = [];
		chartData.datasets[PLUS_DATASET].data = [];
		chartData.datasets[MINUS_DATASET].data = [];
		this.update();
	}

} // class ChartHandler

window.onload = function() {
	// Create new ChartHandler to control the chart, all further operations will be 
	// called using 'window.chartHandler'
	window.chartHandler = new ChartHandler();
}; // window.onload

$(document).ready(function() {

/*	document.getElementById('addRandomData').addEventListener('click', function() {
		console.log('[INFO] ##### Entering function addRandomData #####');

		// Only show the latest data inputs
		// Only need to check one dataset since they should both be the same length
		if(chartData.datasets[PLUS_DATASET].data.length >= MAX_DATA_LENGTH) {
			DEBUG_LOG('Dataset data is longer than MAX_DATA_LENGTH (' + MAX_DATA_LENGTH + '), removing first datapoint');
			// Remove the label first
			chartData.labels.shift();
			// Remove the first data point
			chartData.datasets[PLUS_DATASET].data.shift();
			chartData.datasets[MINUS_DATASET].data.shift();
		}

		let day = WEEKDAYS[WEEKDAY_NR++];
		if(WEEKDAY_NR == (WEEKDAYS.length)) {
			WEEKDAY_NR = 0;
		}
		
		DEBUG_LOG('Current labels: ' + chartData.labels);
		DEBUG_LOG('Weekday to add: ' + day);
		DEBUG_LOG('Plus dataset  before additional data: ' + chartData.datasets[PLUS_DATASET].data);
		DEBUG_LOG('Minus dataset before additional data: ' + chartData.datasets[MINUS_DATASET].data);

		// Add label
		chartData.labels.push(day);
		// Add random data to dataset
		chartData.datasets[PLUS_DATASET].data.push(random());
		chartData.datasets[MINUS_DATASET].data.push(random());

		window.chartHandler.update();
	}); // addRandomData*/

	document.getElementById('deleteStoredData').addEventListener('click', function() {
		if (confirm('Are you sure you want to remove previously saved data?')) {
			DEBUG_LOG('Removing stored data (cookies)');
			Cookies.remove('Labels');
			Cookies.remove('PlusData');
			Cookies.remove('MinusData');
			window.chartHandler.clear();
		} else {
			// Do nothing!
		}
	});

	document.getElementById('submitData').addEventListener('click', function() {
		console.log('[INFO] ##### Entering function submitData #####');

		let plus = $('#plusInput').val();
		let minus = $('#minusInput').val();
		
		// Reset the input
		$('#plusInput').val(0);
		$('#minusInput').val(0);

		window.chartHandler.addData(plus, minus);
	}); // submitData

	document.getElementById('plusButton').addEventListener('click', function() {
		let nrPlus = $('#plusInput').val();
		nrPlus++;
		$('#plusInput').val(nrPlus);
	});

	document.getElementById('minusButton').addEventListener('click', function() {
		let nrMinus = $('#minusInput').val();
		nrMinus++;
		$('#minusInput').val(nrMinus);
	});

	// document.getElementById('randomizeData').addEventListener('click', function() {
	// 	console.log('[INFO] Entering function randomizeData');
	// 	var zero = Math.random() < 0.2 ? true : false;
	// 	chartData.datasets.forEach(function(dataset) {
	// 		dataset.data = dataset.data.map(function() {
	// 			return zero ? 0.0 : random();
	// 		});

	// 	});
	// 	window.chart.update();
	// });

	// // var colorNames = Object.keys(window.chartColors);
	// document.getElementById('addDataset').addEventListener('click', function() {
	// 	console.log('[INFO] Entering function addDataset');

	// 	// var colorName = colorNames[chartData.datasets.length % colorNames.length];
	// 	// var dsColor = window.chartColors[colorName];
	// 	var newDataset = {
	// 		label: 'Dataset ' + (chartData.datasets.length + 1),
	// 		// backgroundColor: color(dsColor).alpha(0.5).rgbString(),
	// 		// borderColor: dsColor,
	// 		borderWidth: 1,
	// 		data: []
	// 	};

	// 	for (var index = 0; index < chartData.labels.length; ++index) {
	// 		newDataset.data.push(random());
	// 	}

	// 	chartData.datasets.push(newDataset);
	// 	window.chart.update();
	// });

	// document.getElementById('removeDataset').addEventListener('click', function() {
	// 	console.log('[INFO] Entering function removeDataset');

	// 	chartData.datasets.pop();
	// 	window.chart.update();
	// });

	// document.getElementById('removeData').addEventListener('click', function() {
	// 	console.log('[INFO] Entering function removeData');

	// 	chartData.labels.splice(-1, 1); // remove the label first

	// 	chartData.datasets.forEach(function(dataset) {
	// 		dataset.data.pop();
	// 	});

	// 	window.chart.update();
	// });

}); // $(document).ready(function() {
