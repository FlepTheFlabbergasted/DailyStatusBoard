
$(document).ready(function() {

	// TESTER = document.getElementById('tester');

	// Plotly.plot( TESTER, [{
	//     x: [1, 2, 3, 4, 5],
	//     y: [1, 2, 4, 8, 16] }], { 
	//     margin: { t: 0 } } );

	// /* Current Plotly.js version */
	// console.log( Plotly.BUILD );


	var x = [];
	for (var i = 0; i < 500; i ++) {
		x[i] = Math.random();
	}

	var trace = {
	    x: x,
	    type: 'histogram',
	  };
	var data = [trace];
	Plotly.newPlot('tester', data);

});



// Take user input for histogram and append to array/list
// Data consists of nr of + and - as well as date 
	// Update graphicly when pressing +/- ?

// When user presses "commit" update the histogram with added data
// Save the array with data to file/in Chrome



// Add post it notes...