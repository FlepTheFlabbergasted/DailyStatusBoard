
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
		console.log('[DEBUG]' + string);
	}
}

// Constants
const MAX_DATA_LENGTH = 8;
const PLUS_DATASET = 0;
const MINUS_DATASET = 1;
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Number to iterate through the WEEKDAYS array
var WEEKDAY_NR = 0;

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
 *
 * TODO: Initialize with previously saved data
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
		DEBUG_LOG('Initiating chart with Plus dataset: ' + chartData.datasets[PLUS_DATASET].data);
		DEBUG_LOG('Initiating chart with Minus dataset: ' + chartData.datasets[MINUS_DATASET].data);

		var ctx = document.getElementById('canvas').getContext('2d');
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: chartData,
			options: {
				title: {
					display: true,
					text: 'Daily Status'
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
	    	maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true,
					}]
				}
			}
		}); // window.chart
	} // constructor

	update() {
		this.chart.update();
	}

} // class ChartHandler

window.onload = function() {
	// Create new ChartHandler to control the chart, all further operations will be 
	// called using 'window.chartHandler'
	window.chartHandler = new ChartHandler();
}; // window.onload

function commitData() {
	console.log('[INFO] Entering function commitData');

	var plus = $('#plus-input').val();
	var minus = $('#minus-input').val();
	console.log("Plus: " + plus + " Minus: " + minus);
	histogram.update();
}

$(document).ready(function() {

	document.getElementById('addData').addEventListener('click', function() {
		console.log('[INFO] ##### Entering function addData #####');

		console.log('[INFO] WEEKDAYS: ' + WEEKDAYS);

		// Only show the latest data inputs
		// Only need to check one dataset since they should both be the same length
		if(chartData.datasets[PLUS_DATASET].data.length >= MAX_DATA_LENGTH) {
			DEBUG_LOG('Dataset data is longer than MAX_DATA_LENGTH ( ' + MAX_DATA_LENGTH + '), removing first datapoint');
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
		chartData.labels.push(day);

		DEBUG_LOG('Current labels: ' + chartData.labels);
		DEBUG_LOG('Weekday to add: ' + day);
		DEBUG_LOG('Plus dataset  before additional data: ' + chartData.datasets[PLUS_DATASET].data);
		DEBUG_LOG('Minus dataset before additional data: ' + chartData.datasets[MINUS_DATASET].data);

		// Add data to dataset
		// TODO: Take input from user instead of random data
		chartData.datasets[PLUS_DATASET].data.push(random());
		chartData.datasets[MINUS_DATASET].data.push(random());

		window.chartHandler.update();
	});

	document.getElementById('randomizeData').addEventListener('click', function() {
		console.log('[INFO] Entering function randomizeData');
		var zero = Math.random() < 0.2 ? true : false;
		chartData.datasets.forEach(function(dataset) {
			dataset.data = dataset.data.map(function() {
				return zero ? 0.0 : random();
			});

		});
		window.chart.update();
	});

	// var colorNames = Object.keys(window.chartColors);
	document.getElementById('addDataset').addEventListener('click', function() {
		console.log('[INFO] Entering function addDataset');

		// var colorName = colorNames[chartData.datasets.length % colorNames.length];
		// var dsColor = window.chartColors[colorName];
		var newDataset = {
			label: 'Dataset ' + (chartData.datasets.length + 1),
			// backgroundColor: color(dsColor).alpha(0.5).rgbString(),
			// borderColor: dsColor,
			borderWidth: 1,
			data: []
		};

		for (var index = 0; index < chartData.labels.length; ++index) {
			newDataset.data.push(random());
		}

		chartData.datasets.push(newDataset);
		window.chart.update();
	});

	document.getElementById('removeDataset').addEventListener('click', function() {
		console.log('[INFO] Entering function removeDataset');

		chartData.datasets.pop();
		window.chart.update();
	});

	document.getElementById('removeData').addEventListener('click', function() {
		console.log('[INFO] Entering function removeData');

		chartData.labels.splice(-1, 1); // remove the label first

		chartData.datasets.forEach(function(dataset) {
			dataset.data.pop();
		});

		window.chart.update();
	});

}); // $(document).ready(function() {
