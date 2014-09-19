/*!
 * Copyright(c) 2012 Gil Tamari
 * MIT Licensed
 */

 /**
********************************************************************************************
* name:     k-means clustering algorithm
********************************************************************************************
* desc:   This module is responsible forsupervised clustering algorithm: k-means
*         this algorithm can be impvoed by using spatial indices - i've already used this 
*         using spatial data-structure O(n lgn), with hierarchical clustering
*         
********************************************************************************************
* complex (space): O(n)
* complex (time):  O(n t k)
********************************************************************************************
* code: written by Gil Tamari, you may not use it without my permission
* date: sep-2012
********************************************************************************************
**/

//distances instances - Distances
function KMeans(distances_instance){
  this.distances = distances_instance
}
/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
KMeans.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/************************************************************************
*   name:  pickInitialCentroids
*   desc:  Calculate random mean values for each cluster based on the data
* 
*************************************************************************
*   in:    k - integer +, points - Array[Array[Double]]
*************************************************************************
*   out:   Array[Array[Double]] 
*************************************************************************
*/
KMeans.prototype.pickInitialCentroids = function(k, points) {
   var   previously_used_ids = [],
         max = points.length - 1,
         min = 0,
         i,
         centroid_id,
         centroids = new Array(k) // creating a k-sized array

   for (i = 0; i < k; i++) {
       // pick point index that we haven't used yet
       do{

         centroid_id = this.getRandomInt(min,max) // randomly creating an id
       } while ((previously_used_ids.indexOf(centroid_id) !== -1))

       previously_used_ids.push(centroid_id);
       // Create DataPoint that will represent the cluster's centroid.
       centroids[i] = points[centroid_id] // picking datapoints
   }

   return centroids;
}
/************************************************************************
*   name:  closestCentroid
*   desc:  finds the closest centroids to a point [dimensionless], returns the index
*          of the closest centroid
* 
*************************************************************************
*   in:    point - Array[Double], centroids - Array[Array[Double]], distance - function
*************************************************************************
*   out:   Double - returns the index (off the centroids array) of the closest centroid
*************************************************************************
*/
KMeans.prototype.findClosestCentroid = function(centroids, point, distance) {

   var min_distance = Infinity,//Number.POSITIVE_INFINITY,
      closest_centroid_index = -1,
      i,
      dist,
      n = centroids.length

   for (i = 0; i < n; i++) {
      dist = distance(centroids[i], point)

      // if the d == minDistance then keep current selection
      if (dist < min_distance) {
         min_distance           = dist
         closest_centroid_index = i
      }// if
   }// for
   return closest_centroid_index
}// findClosestCentroid

/************************************************************************
*   name:  findCentroid
*   desc:  finding the center of mass
*************************************************************************
*   in:    points -  Array[Array[Double]]
*************************************************************************
*   out:   Array[Double] - representing the center of mass
*************************************************************************
*/
KMeans.prototype.findCentroid = function(points) {
   var i,
       dimensions,
       mean_attributes,
       j;


   if (points.length === 0) {
      return false
   }// if
   else if(points.length === 1){
      return points
   }// else

   // how many dimensions we're dealing with
   dimensions      = points[0].length
   mean_attributes = new Array(dimensions)

   for (i = 0; i < dimensions; i++) {
      mean_attributes[i] = 0
   }// for

   for(i=0; i < points.length; i++){

      for(j=0; j < dimensions; j++){
         mean_attributes[j] += points[i][j];
      }// for

   }// for

   for (i = 0; i < dimensions; i++) {
      mean_attributes[i] = mean_attributes[i] / points.length
   }

   return mean_attributes
}//findCentroid

/************************************************************************
*   name:  compareVecs
*   desc:  quick method of comparing 2 vectors
*          via 'lt', 'let', 'gt', 'get', 'eq' , '*'  (we don't care)
*************************************************************************
*   in:    in_vector, vec_to_compare - Array[Double], operator - string
*************************************************************************
*   out:   bool
*************************************************************************
*/
KMeans.prototype.compareVecs = function(in_vector,vec_to_compare,operator){
  var i,
      flag,
      val,
      val_comp,
      bSame = true;
  if(in_vector.length === vec_to_compare.length){

    for(i=0; i < in_vector.length; i++){

      val = in_vector[i];
      val_comp = vec_to_compare[i];

      if (val !== '*'){
        switch(operator){
          case 'lt':
            flag = val < val_comp;
            break;
          case 'let':
            flag = val <= val_comp;
            break;
          case 'gt':
            flag = val > val_comp;
            break;
          case 'get':
            flag = val >= val_comp;
            break;
          case 'eq':
            flag = val === val_comp;
            break;
          default:

            flag = false;
        }
      }
      else{
        flag = true;
      }

      if (!flag){
        bSame = false;
        break;
      }

    }
    return bSame;
  }
}

 /************************************************************************
}
*   name:  calculateCost
*   desc: 
*   There is a risk to get stuck in a local minima. By local minima i mean the local minima of the cost
*   function:
*   J(x_1,...,x_n, c_1,...c_m, u_1,....u_k) = (1/m) * sum(i=1..m) (X_i - u_[c_i])^2
*   X_i = points
*   c_i = index of centroid in cluster
*   u_i = centroids
*************************************************************************
*   in:    callback function  
*************************************************************************
*   out:  [double] distance / # of points
*************************************************************************
*/
KMeans.prototype.calculateCost = function( closest_centroids_to_points_indices,
                                            centroids,
                                            points){
   var   len = points.length,
         ret_value = 0.0,
         i,
         distance = this.distances.euclidean

   for(i=0; i < len; i++){
      ret_value += 1.0 * Math.abs(distance(points[i], centroids[closest_centroids_to_points_indices[i]]))
   }
   return ret_value / len;

}
/************************************************************************
*   name:  cloneArray
*   desc:  we're cloning the points, to be used in an array we'll delete elements from!
*          this is the fastest way to clone! jspref.com verified
*************************************************************************
*   in:    Array[Double]
*************************************************************************
*   out:   Array[Double]
*************************************************************************
*/
KMeans.prototype.cloneArray = function(input_array){
  var i, 
      len = input_array.length,
      arr_clone = new Array(len)

  for (i = 0; i < len; i += 1) {
    arr_clone[i] = input_array[i]
  }// for
  return arr_clone;
}// cloneArray

/************************************************************************
*   name:  kmeans - clustering algorithm
*   desc:  given a set of data points N and an input k points to be centroids
*          kmeans is a super-fast supervised algorithm for clustering points 
*          it does this in O(n) Space complexity and O(t * k * n) time complexity 
*          it is the industry's choice due to its simplicity and performance, 
*          can be parallelized when the data are divided into N sets and each separate data set is clusterd
*          in parallel, on N different computational units.[ map reduce for instance]
*          the algorithm converges quickly, if you're using metric other than 
*          euclid, watch out. Usually the number of K is determined by the data
*          so you need to adjust the parameters until they'll fit your needs
*          hierrchical clustering algorithm can be a good usage with kmeans
*          
*          
*************************************************************************
*   in:    points - Array[Array[Double]], 
*          k - natural > 0 , distance = String, snap_period and snap_cb - FFU
*          taking a "slice" of the process 
*************************************************************************
*   out:   Array[Double]
*************************************************************************
*/
KMeans.prototype.cluster = function(points, k, distance, snap_period, snap_cb) {
  var    centroids_changed = true,
         clusters,
         centroids,
         all_clusters            = new Array(k),
         new_centroid_values,
         iterations              = 10,
         iteration,
         iteration2,
         current_cost,
         i,
         j,
         old_centroid_values,
         closest_centroid_index,
         closest_centroids_to_points_indices, // the point is assigned to which cluster?
         all_centroids           = new Array(k),
         cost                    = Infinity, // worst cost possible , we want to minimize it
         cost2                   = Infinity

  distance    = distance || 'euclidean'
  snap_cb     = snap_cb || null
  snap_period = snap_period || null


  if (typeof distance === 'string') {
    distance = this.distances[distance]
  }// if

  //Insufficient number of points!
  if ((points.length < 2) || (points.length < k)){
    return {clusters: [], centroids: []}
  }// if
  //k = k+1

  // we need to perform this for several iterations not to stuck in a local extrema
  for(iteration=0; iteration < iterations; iteration++){
    cost     = Infinity
    clusters = new Array(k) // output clusters array

    // Assign points to each set based on minimum distance from the centroids
    for(iteration2=0; iteration2 < iterations; iteration2++){

      for(i=0; i < k; i++){
        clusters[i] = [];
      }// for - clusters init

      // we create an array of size N which will be our temporary clusters array linkage
      // by indices
      closest_centroids_to_points_indices = new Array(points.length)

      // we lottery k centroids off the points array of size N
      // this step is called "Seed"
      // choosing your seeds affects the speed, if you have some pre-defined knowledge
      // of the data you can make use of, apply it to smart-pick the centroids
      // closer seed centroids = faster run . Ref: kmeans++ algorithm
      centroids                           = this.pickInitialCentroids(k, points)


      // running over all the points
      for(i=0; i < points.length; i++){

        // we find the closest centroid index O(k) , k < N 
        // based on the distance metric
        closest_centroid_index = this.findClosestCentroid(centroids, points[i], distance)
        // if there is such a centroid
        if (closest_centroid_index !== -1){

           clusters[closest_centroid_index].push(points[i]) // insert the point to the clusters
           closest_centroids_to_points_indices[i] = closest_centroid_index // we use our temp array to specific to which cluster that point belongs
        }// if - centroid
      }

      // we see how well our mean distance performs in this iteration
      // to the seed centroids
      current_cost = this.calculateCost( closest_centroids_to_points_indices,
                                        centroids,
                                        points) 

      // current cost < previous one?
      if (current_cost < cost){
        cost          = current_cost // switch
        all_centroids = this.cloneArray(centroids) // we clone the temp centroids to "all"
        all_clusters  = this.cloneArray(clusters) // we clone the clusters to "all"
        ////console.log('clusters size: ' + clusters.length + ' after');
      }// if
    }// for


    // Calculate new cluster centroids, and
    // check if any of the centroids has changed
    centroids_changed = false;

    centroids = this.cloneArray(all_centroids);


    // running on our minimized clusters and centroids, we need to verify we have the best centroids / clusters
    for (i = 0; i < centroids.length; i++) {

      // we do have clusters
      if (all_clusters[i].length > 0) {
        new_centroid_values = this.findCentroid(all_clusters[i]) // finding center of mass of the given cluster, maybe there's a better centroid!
        old_centroid_values = all_centroids[i]

        if (new_centroid_values && !this.compareVecs(old_centroid_values, new_centroid_values,'eq')){ // we compare the found centroid from above and 
                                                                                                 // the one we just found, they are DIFFERENT

          centroids[i] = new_centroid_values // new centroids found

          // rebuilding centroids!
          for(j=0; j < points.length; j++){
            closest_centroid_index = this.findClosestCentroid(centroids, points[i], distance);

            if (closest_centroid_index !== -1){
               closest_centroids_to_points_indices[i] = closest_centroid_index;
            }
          }
          centroids_changed = true
          current_cost = this.calculateCost( closest_centroids_to_points_indices,
                                            centroids,
                                            points)
          // calculating against cost2 
          if (current_cost < cost2){
            cost2         = current_cost;
            all_centroids = this.cloneArray(centroids)
          }
        }

      }
      else{
        // keep mean unchanged if cluster has no elements.
      }// else

    }//for - last for 
  }// for - main iterations


  // guard against empty clusters to be RE-USED
  for(i = all_clusters.length - 1; i >= 0;i--){

    if (all_clusters[i].length === 0 ){
       all_clusters.splice(i,1);
       all_centroids.splice(i,1);
    }// if
  }// for

   return {clusters: all_clusters, centroids: all_centroids}
}

module.exports = KMeans

