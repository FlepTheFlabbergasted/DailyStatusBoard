
// https://www.chartjs.org/samples/latest/charts/bar/stacked.html
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
	constructor(plus, minus) {
		console.log('[INFO] ##### Entering StatsHandler::constructor #####');
		statsChartData.datasets[0].data = [plus, minus];

		var ctx = document.getElementById('statsCanvas').getContext('2d');
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: statsChartData,
			options: {
				title: {
					display: true,
					fontSize: 72,
					text: 'All-time Stats'
				},
				legend: {
					display: false,
				},
				tooltips: {
					bodyFontSize: 36,
			      	callbacks: {
				        title: function(tooltipItem, data) {
				        },
				        label: function(tooltipItem, data) {
				            let index = tooltipItem.index;
				            return data.datasets[0].data[index] || '';
				        },
				        afterLabel: function(tooltipItem, data) {
				        }
		      		}
				},
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {
							fontSize: 36,
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

	setData(plus, minus){
		statsChartData.datasets[0].data = [plus, minus];
		this.chart.update();
	}

	update() {
		this.chart.update();
	} // update
} // class ChartHandler