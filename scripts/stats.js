
// https://www.chartjs.org/samples/latest/charts/bar/stacked.html
const DEBUG = true;
function DEBUG_LOG(string) {
	if(DEBUG == true) {
		console.log('[DEBUG] ' + string);
	}
}

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

const STATS_LABELS = ['Plus', 'Minus'];
const Y_AXES_TICKS_SUGGESTED_ALL_TIME_MAX = 5;

/**
 * Data for the displayed bar chart, this variable is used when updating
 * the chart. Initialy start with no labels and no data that later gets added
 * from user input. 
 */
var statsChartData = {
	labels: ['Plus', 'Minus'],
	datasets: [{
		label: 'Stats Dataset',
		backgroundColor: [window.chartColors.greenOp, window.chartColors.redOp],//color(window.chartColors.green).alpha(0.5).rgbString(),
		borderColor: [window.chartColors.green, window.chartColors.red],
		borderWidth: 1,
		data: [0, 0]
	}]
}; // statsChartData

class StatsHandler {
	constructor() {
		console.log('[INFO] ##### Entering StatsHandler::constructor #####');

		let allTimeStatsData = Cookies.getJSON('AllTimeStatsAndCurrentDayData');

		if(allTimeStatsData != undefined) {

			DEBUG_LOG('Initiating chart with previously stored data:\nPlusData [' + allTimeStatsData + ']');
			//statsChartData.labels = ['Plus', 'Minus'];
			statsChartData.datasets[0].data = allTimeStatsData;
		}

		var ctx = document.getElementById('statsCanvas').getContext('2d');
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: statsChartData,
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
				          return "All-time stats";// + data['labels'][tooltipItem[0]['index']];
				        },
				        label: function(tooltipItem, data) {
				          // return data['datasets'][0]['data'][tooltipItem['index']];
				          let index = tooltipItem['index'];
				          return;
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
							stepSize: 1,
							beginAtZero: true,
							suggestedMax: Y_AXES_TICKS_SUGGESTED_ALL_TIME_MAX,
           				}
					}]
				}
			}
		}); // window.chart
	} // constructor

	update() {
		this.chart.update();
	} // update
} // class ChartHandler

window.onload = function() {
	// Create new ChartHandler to control the chart, all further operations will be 
	// called using 'window.chartHandler'
	window.statsHandler = new StatsHandler();
}; // window.onload

$(document).ready(function() {
	document.getElementById('dailyStatusBoard').addEventListener('click', function() {
		window.open("index.html", "_self");
	});
}); // $(document).ready(function() {
