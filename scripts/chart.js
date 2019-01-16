
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
const MAX_DATA_LENGTH = 10; // At most 10 days showing in the chart
const MAX_DATA_INPUT = 15;	// At most 15 +/- in input
const PLUS_DATASET = 0;			// Dataset index
const MINUS_DATASET = 1;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// TODO: Remove once figured out how to retreive min/max ticks in chart options
const Y_AXES_TICKS_SUGGESTED_MIN = -5;
const Y_AXES_TICKS_SUGGESTED_MAX = 5;

var DATA_DATES = [];
var DAILY_COMMENTS = [];

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

		let labels = Cookies.getJSON('Labels');
		let plusData = Cookies.getJSON('PlusData');
		let minusData = Cookies.getJSON('MinusData');

		if(plusData != undefined && minusData != undefined) {
			// We retreive DATA_DATES here since getting it if nothing else is defined overwrites it with 'undefined'
			DATA_DATES = Cookies.getJSON('Data Dates');

			DEBUG_LOG('Initiating chart with previously stored data:\nLabels [' + labels + '], PlusData [' + plusData + '], MinusData [' + minusData + '], Data Dates [' +  DATA_DATES + ']');
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
					// mode: 'index',
					// intersect: false,
		      callbacks: {
		        title: function(tooltipItem, data) {
		          // console.log("You're hovering on index: " + tooltipItem[0]['index']);
		          return "Comment:";// + data['labels'][tooltipItem[0]['index']];
		        },
		        label: function(tooltipItem, data) {
		          // return data['datasets'][0]['data'][tooltipItem['index']];
		          let index = tooltipItem['index'];
		          console.log("index: " + index);
		          if(index == 0) {
		          	return "This is the FIRST one";
		          } else if(index == 1) {
		          	return "This is the SECOND one";
		          } else {
		          	return "And so on...";
		          }
		        },
		        afterLabel: function(tooltipItem, data) {
		          // var dataset = data['datasets'][0];
		          // var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
		          // return '(' + percent + '%)';
		        }
		      }
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

	isValidInput(nrPlus, nrMinus) {
		// Minor fault handling
		// We must have any valid data for input to the graph
		if(!nrPlus || !nrMinus) { // Javascript "truthy"
			DEBUG_LOG('No valid input data, returning');
			return false;
		} else if(nrPlus == 0 && nrMinus == 0) {
			DEBUG_LOG('No valid input data (nrPlus: 0, nrMinus: 0), returning');
			return false;
		} else if(nrPlus < 0 || nrMinus < 0) {
			DEBUG_LOG('No valid input data (nrPlus < 0 or nrMinus < 0), returning');
			return false;
		}

		if(nrPlus > MAX_DATA_INPUT || nrMinus > MAX_DATA_INPUT) {
			DEBUG_LOG('No valid input data, (nrPlus or nrMinus > MAX_DATA_INPUT(' + MAX_DATA_INPUT + ')), returning');
			return false;
		}

		return true;
	}

	addData(nrPlus, nrMinus) {
		console.log('[INFO] ##### Entering ChartHandler::addData #####');
		DEBUG_LOG("User input, Plus: " + nrPlus + " nrMinus: " + nrMinus);

		if(!this.isValidInput(nrPlus, nrMinus)){
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

		DEBUG_LOG('Data Dates: ' + DATA_DATES);
		DEBUG_LOG('Label to add: ' + WEEKDAYS[new Date().getDay()]);
		DEBUG_LOG('Plus data  to add: ' + nrPlus);
		DEBUG_LOG('Minus data to add: ' + nrMinus);

		// TODO: Uncomment when not testing
		// Overwrite data if adding on the same day (gets date as YYYY-MM-DD)
		// if(DATA_DATES[DATA_DATES.length - 1] == new Date().toISOString().slice(0,10)) {
		// 	// Remove last index of array
		// 	DATA_DATES.pop();
		// 	chartData.labels.pop();
		// 	chartData.datasets[PLUS_DATASET].data.pop();
		// 	chartData.datasets[MINUS_DATASET].data.pop();
		// }
		
		// Add new data
		DATA_DATES.push(new Date().toISOString().slice(0,10));
		chartData.labels.push(WEEKDAYS[new Date().getDay()]);
		chartData.datasets[PLUS_DATASET].data.push(nrPlus);
		chartData.datasets[MINUS_DATASET].data.push(nrMinus * -1);

		// Store Data
		DEBUG_LOG('Storing Data Dates: ' + DATA_DATES);
		DEBUG_LOG('Storing labels: ' + chartData.labels);
		DEBUG_LOG('Storing plus dataset: ' + chartData.datasets[PLUS_DATASET].data);
		DEBUG_LOG('Storing minus dataset: ' + chartData.datasets[MINUS_DATASET].data);
		Cookies.set('Data Dates', DATA_DATES);
		Cookies.set('Labels', chartData.labels);
		Cookies.set('PlusData', chartData.datasets[PLUS_DATASET].data);
		Cookies.set('MinusData', chartData.datasets[MINUS_DATASET].data);		

		this.update();
	} // addData

	clear() {
		DATA_DATES = [];
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

	document.getElementById('removeData').addEventListener('click', function() {
		if (chartData.labels.length > 0) {
			// Remove last index of arrays
			chartData.labels.pop();
			chartData.datasets[PLUS_DATASET].data.pop();
			chartData.datasets[MINUS_DATASET].data.pop();

			DATA_DATES = Cookies.getJSON('Data Dates');
			let labels = Cookies.getJSON('Labels');
			let plusData = Cookies.getJSON('PlusData');
			let minusData = Cookies.getJSON('MinusData');

			DATA_DATES.pop();
			labels.pop();
			plusData.pop();
			minusData.pop();

			Cookies.set('Data Dates', DATA_DATES);
			Cookies.set('Labels', chartData.labels);
			Cookies.set('PlusData', chartData.datasets[PLUS_DATASET].data);
			Cookies.set('MinusData', chartData.datasets[MINUS_DATASET].data);

			window.chartHandler.update();
		} else {
			DEBUG_LOG('What data are ypu trying to remove???????');
		}
	});

	document.getElementById('deleteStoredData').addEventListener('click', function() {
		if (confirm('Are you sure you want to remove previously saved data?')) {
			DEBUG_LOG('Removing stored data (cookies)');
			Cookies.remove('Data Dates');
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
