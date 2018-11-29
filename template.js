
var data = [{
  x: [1999, 2000, 2001, 2002],
  y: [10, 15, 13, 17],
  type: 'histogram'
}];


// Class to hold a data point for the histogram
class ChartData {
	constructor(plus, minus, date) {
    console.log("Creating a ChartData class");
   	this.plus = plus;
		this.minus = minus; 
		this.date = date;
		//week = 0 // TODO fuction
  }

  print() {
  	console.log("Plus: " + this.plus + " Minus: " + this.minus + " Date: " + this.date);
  }
}

class Histogram {
  constructor() {
    console.log("Creating a new histogram");
    this.chartData = new ChartData(1, 2, new Date().toISOString().substring(0, 10));
  }

  update() {
    console.log("Here is where I would update the chart");
    // new Date().toISOString().substring(0, 10), // YYYY-MM-DD
    this.chartData.print();
    console.log("x: " + x);

    x.push(14);

    Plotly.redraw('histogram-div');
  }
}



var histogram = new Histogram();

$(document).ready(function() {

	// TESTER = document.getElementById('tester');

	// Plotly.plot( TESTER, [{
	//     x: [1, 2, 3, 4, 5],
	//     y: [1, 2, 4, 8, 16] }], { 
	//     margin: { t: 0 } } );

	// /* Current Plotly.js version */
	// console.log( Plotly.BUILD );


	var layout = {
	  title: 'Daily Status',
	  xaxis: {
	    title: 'Day',
	    showgrid: false,
	    zeroline: false
	  },
	  yaxis: {
	    title: '',
	    showline: false
	  }
	};

	// var trace = {
	//     x: x,
	//     type: 'histogram',
	//   };
	// var data = [trace];
	Plotly.newPlot('histogram-div', data, layout);

});

function commitData() {
	//Get
	var plus = $('#plus-input').val();
	var minus = $('#minus-input').val();
	console.log("Plus: " + plus + " Minus: " + minus);
	histogram.update();
}

// Take user input for histogram and append to array/list
// Data consists of nr of + and - as well as date 
	// Update graphicly when pressing +/- ?

// When user presses "commit" update the histogram with added data
// Save the array with data to file/in Chrome


// Add post it notes...