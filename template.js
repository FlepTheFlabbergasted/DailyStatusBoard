
// https://www.chartjs.org/samples/latest/charts/bar/stacked.html

function random(){
	return Math.random() * 10 + 1;
}


window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
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
				backgroundColor: window.chartColors.green,
				data: [
					random(),
					random(),
					random(),
					random(),
					random(),
					random(),
					random()
				]
			}, {
				label: 'Dataset 2',
				backgroundColor: window.chartColors.red,
				data: [
					random() * -1,
					random() * -1,
					random() * -1,
					random() * -1,
					random() * -1,
					random() * -1,
					random() * -1
				]
			}]
		};

// window.onload = function() {
// 	var ctx = document.getElementById('canvas').getContext('2d');
// 	window.myBar = new Chart(ctx, {
// 		type: 'bar',
// 		data: barChartData,
// 		options: {
// 			responsive: true,
//     	maintainAspectRatio: false,
// 			legend: {
// 				position: 'top',
// 			},
// 			title: {
// 				display: true,
// 				text: 'Chart.js Bar Chart'
// 			}
// 		}
// 	});

// };



	window.onload = function() {
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
							stacked: true,
						}],
						yAxes: [{
							stacked: true
						}]
					}
				}
			});
		};



function commitData() {
	var plus = $('#plus-input').val();
	var minus = $('#minus-input').val();
	console.log("Plus: " + plus + " Minus: " + minus);
	histogram.update();
}


$(document).ready(function() {

document.getElementById('randomizeData').addEventListener('click', function() {
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

document.getElementById('addData').addEventListener('click', function() {
	if (barChartData.datasets.length > 0) {
		var month = weekDays[barChartData.labels.length % weekDays.length];
		barChartData.labels.push(month);

		for (var index = 0; index < barChartData.datasets.length; ++index) {
			// window.myBar.addData(random(), index);
			barChartData.datasets[index].data.push(random());
		}

		window.myBar.update();
	}
});

document.getElementById('removeDataset').addEventListener('click', function() {
	barChartData.datasets.pop();
	window.myBar.update();
});

document.getElementById('removeData').addEventListener('click', function() {
	barChartData.labels.splice(-1, 1); // remove the label first

	barChartData.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myBar.update();
});

});

// Take user input for histogram and append to array/list
// Data consists of nr of + and - as well as date 
	// Update graphicly when pressing +/- ?

// When user presses "commit" update the histogram with added data
// Save the array with data to file/in Chrome



// Add post it notes...
