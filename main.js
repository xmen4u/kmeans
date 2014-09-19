/**
********************************************************************************************
* name:     Main Controller
********************************************************************************************
* desc:   This module is responsible for using the DBScan clustering algorithm,
*		   this example uses the "maximum recommended" number of dimensions (16), before 
*		   "the curse of dimensionality"
********************************************************************************************
* code: written by Gil Tamari, you may not use it without my permission - BSD license
* date: sep-2012
********************************************************************************************
**/

// global variable definition
var Distance 	 = require('./lib/distance'),
	distances    = new Distance(),
	// KMeans section
	KMeans       = require('./lib/kmeans.js'),
	kmeans,
	// File section
	fs           = require('fs'),
	readline     = require('readline'), // using the UNSTABLE readline built-in node module
	// Stream section
	points       = [],
	rl, // read-line
	in_stream

/************************************************************************
*   name:  translateToSub
*   desc:  
*************************************************************************
*   in:    based_on_cells - Array[INT] , in_point - Array[Double]
*		   based_on_cells -the indices where the features we want reside in the n-vector
*		   in_point - the n-vector
*************************************************************************
*   out:   Array[Double]
*************************************************************************
*/
function translateToSub(in_point,based_on_cells){
  var ret=[];

  based_on_cells.forEach(function(index){
    ret.push(in_point[index]);
  });
  return ret;
}// translateToSub


/************************************************************************
*   name:  distanceFunction
*   desc:  this will be the distance function to be used, we chose haversine
*		   distance, as we require higher accuracy than the rest, the process is 
*		   that each vector can contain multiple features, n-vector, thus
*		   we defined our points to reside in the first 2 cells , in our case of 2-d clustering
*************************************************************************
*   in:    v1, v2 - Array[Double], each is an n-vector
*************************************************************************
*   out:   Double
*************************************************************************
*/
distances.customDistance = function(v1,v2){
	var based_on_cells = [0,6] // where the 2-d cells reside in

	if (based_on_cells instanceof Array){
	  v1 = translateToSub(v1,based_on_cells)

	  v2 = translateToSub(v2,based_on_cells)

	}// if - based_on_cells

	return distances.euclidean(v1,v2)//haversine(v1,v2)
}// distanceFunction




in_stream = fs.createReadStream('./books.txt')
rl        = readline.createInterface({input: in_stream,terminal: false})

rl.on('line', function(line) {
	points.push(JSON.parse(line))
});

rl.on('close', function() {
	var clustering_obj

	// initializing it here, because of our new custom distance function
	kmeans = new KMeans(distances)

    clustering_obj = kmeans.cluster(points,29,'customDistance')
    console.log('FINISHED reading ' + points.length + ' and clustering them')
    console.log(clustering_obj)

});
