[![Build Status](https://travis-ci.org/xmen4u/kmeans.svg)](https://travis-ci.org/xmen4u/kmeans)


## KMeans clustering algorithm 
============================================

A node module, that implements k-means clustering algorithm

k-means is a super-fast supervised algorithm for clustering points 
it does this in O(n) Space complexity and O(t * k * n) time complexity 
it can be parallelized when the data are divided into N sets and each separate data set is clusterd
the algorithm converges quickly

It is also provided with a full example of usage and dataset creation.
I hope to provide a working stack [FE + BE] to use this with real-time and cache capabilities

using jSHint, matchdep , stream, grunt.js 

Use this with my permission only

## ToC
---------------------

1. [Main app](#main)


<a name="main">Main app</a>
---------------------


## Install
```
npm install kmeans
```

place the ```distance.js``` where ever you want and include it, i've used an iOc style 
so you could adjust it and plug-it in the module


## Initialization

we need to initialize the distance object, you can add any distance metric you wish 
to distance.js
```
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

```
after initialization, you need to create a multi-dimensional vector, an array of arrays:
```[[1,2],[1,4],[2,5],[5,9],...,[10,12]]```
just like the "creation of the data set line", you can find the model inside /models , it looks like:

```


in code we grab it via stream from a line-by-line [newline] structured flat file [so we won't have limit on memory space]
```
in_stream = fs.createReadStream('./books.txt'),
rl = readline.createInterface({input: in_stream,terminal: false})

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
```
finally we can use the algorithm on specific coordinates of the vector[s], we do that
via the translateToSub
```
function translateToSub(in_point,based_on_cells){
  var ret=[];

  based_on_cells.forEach(function(index){
    ret.push(in_point[index]);
  });
  return ret;
}// translateToSub


distances.customDistance = function(v1,v2){
	var based_on_cells = [0,6] // where the 2-d cells reside in

	if (based_on_cells instanceof Array){
	  v1 = translateToSub(v1,based_on_cells)

	  v2 = translateToSub(v2,based_on_cells)

	}// if - based_on_cells

	return distances.euclidean(v1,v2)//haversine(v1,v2)
}

```


## License

BSD -  ask for my permission
