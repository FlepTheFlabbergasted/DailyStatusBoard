
// https://www.chartjs.org/samples/latest/charts/bar/stacked.html

// Take user input for histogram and append to array/list
// Data consists of nr of + and - as well as date 
	// Update graphicly when pressing +/- ?

// When user presses "commit" update the histogram with added data
// Save the array with data to file/in Chrome

// Add post it notes...

// class StackedBarChart {
// 	constructor() {

// 	}
	
// 	init(){

// 	}

// }

function random(){
	return Math.ceil(Math.random() * 10 + 1);
}

var MAX_DATA_LENGTH = 8;
var DAY_NR = 0;

var GREEN_DATASET = 0;
var RED_DATASET = 1;


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

// var color = Chart.helpers.color;
var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

var barChartData = {
	labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	datasets: [{
		label: 'Dataset 1',
		backgroundColor: window.chartColors.greenOp,//color(window.chartColors.green).alpha(0.5).rgbString(),
		borderColor: window.chartColors.green,
		borderWidth: 1,
		data: [
			random(),
			random(),
			random(),
			random(),
			random()
		]
	}, {
		label: 'Dataset 2',
		backgroundColor: window.chartColors.redOp,
		borderColor: window.chartColors.red,
		borderWidth: 1,
		data: [
			random() * -1,
			random() * -1,
			random() * -1,
			random() * -1,
			random() * -1
		]
	}]
}; // barChartData

window.onload = function() {
	console.log('[INFO] Initiating Chart');
	console.log('[DEBUG] barChartData green dataset: ' + barChartData.datasets[GREEN_DATASET].data);
	console.log('[DEBUG] barChartData red dataset: ' + barChartData.datasets[RED_DATASET].data);

	var ctx = document.getElementById('canvas').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			title: {
				display: true,
				text: 'Chart.js Bar Chart - Stacked'
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
	});
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
		console.log('[INFO] ####### Entering function addData #######');

		console.log('[INFO] weekDays: ' + weekDays);

		// Only show the latest data inputs
		// Only need to check one dataset since they should both be the same length
		if(barChartData.datasets[GREEN_DATASET].data.length >= MAX_DATA_LENGTH) {
			console.log('[DEBUG] Dataset data is longer than MAX_DATA_LENGTH: ' + barChartData.datasets[GREEN_DATASET].data.length);
			
			console.log('[DEBUG] Labels before shift: ' + barChartData.labels);
			console.log('[DEBUG] Green dataset  before shift: ' + barChartData.datasets[GREEN_DATASET].data);
			console.log('[DEBUG] Red dataset before shift: ' + barChartData.datasets[RED_DATASET].data);

			// Remove the label first
			// barChartData.labels.splice(0, 1);
			barChartData.labels.shift();

			// Remove the first data point
			barChartData.datasets[GREEN_DATASET].data.shift();
			barChartData.datasets[RED_DATASET].data.shift();


			console.log('[DEBUG] Labels after shift: ' + barChartData.labels);
			console.log('[DEBUG] Green after shift: ' + barChartData.datasets[GREEN_DATASET].data);
			console.log('[DEBUG] Red after shift: ' + barChartData.datasets[RED_DATASET].data);
		}

		console.log('[DEBUG] Labels before push: ' + barChartData.labels);
		console.log('[DEBUG] DAY_NR: ' + DAY_NR);

		// var day = weekDays[barChartData.labels.length % weekDays.length];
		var day = weekDays[DAY_NR++];
		if(DAY_NR == (weekDays.length)) {
			DAY_NR = 0;
		}
		barChartData.labels.push(day);

		console.log('[DEBUG] Labels after push: ' + barChartData.labels);
		console.log('[DEBUG] Day: ' + day);
		console.log('[DEBUG] Green dataset  before shift: ' + barChartData.datasets[GREEN_DATASET].data);
		console.log('[DEBUG] Red dataset before shift: ' + barChartData.datasets[RED_DATASET].data);

		barChartData.datasets[GREEN_DATASET].data.push(random());
		barChartData.datasets[RED_DATASET].data.push(random());
		

		console.log('[DEBUG] Green after shift: ' + barChartData.datasets[GREEN_DATASET].data);
		console.log('[DEBUG] Red after shift: ' + barChartData.datasets[RED_DATASET].data);

		window.myBar.update();
	
	});

	document.getElementById('randomizeData').addEventListener('click', function() {
		console.log('[INFO] Entering function randomizeData');
		var zero = Math.random() < 0.2 ? true : false;
		barChartData.datasets.forEach(function(dataset) {
			dataset.data = dataset.data.map(function() {
				return zero ? 0.0 : random();
			});

		});
		window.myBar.update();
	});

	// var colorNames = Object.keys(window.chartColors);
	document.getElementById('addDataset').addEventListener('click', function() {
		console.log('[INFO] Entering function addDataset');

		// var colorName = colorNames[barChartData.datasets.length % colorNames.length];
		// var dsColor = window.chartColors[colorName];
		var newDataset = {
			label: 'Dataset ' + (barChartData.datasets.length + 1),
			// backgroundColor: color(dsColor).alpha(0.5).rgbString(),
			// borderColor: dsColor,
			borderWidth: 1,
			data: []
		};

		for (var index = 0; index < barChartData.labels.length; ++index) {
			newDataset.data.push(random());
		}

		barChartData.datasets.push(newDataset);
		window.myBar.update();
	});

	document.getElementById('removeDataset').addEventListener('click', function() {
		console.log('[INFO] Entering function removeDataset');

		barChartData.datasets.pop();
		window.myBar.update();
	});

	document.getElementById('removeData').addEventListener('click', function() {
		console.log('[INFO] Entering function removeData');

		barChartData.labels.splice(-1, 1); // remove the label first

		barChartData.datasets.forEach(function(dataset) {
			dataset.data.pop();
		});

		window.myBar.update();
	});

}); // $(document).ready(function() {
