function generateBookDataset(num_of_elements){
	var rows = [],
		price,
		age,
		rating,
		id,
		pages_no,
		readers_no,
		genere, // http://en.wikipedia.org/wiki/List_of_literary_genres
		i

	for(i = 0; i < num_of_elements; i++){

		// creating a random age and rating
		rating = Math.random() * 5 // 0..5
		age    = Math.floor(Math.random() * (200 + 1))// 0..200
		
		// get reference price
		price  = Math.random() * 200// 0..200
		
		// add some noise
		price  = price * (Math.random() * 0.4 + 0.8)

		id    = Math.floor(Math.random() * (num_of_elements - 1 + 1)) + 1

		pages_no = Math.floor(Math.random() * (1000 - 1 + 1)) + 1

		readers_no = Math.floor(Math.random() * (400000 + 1))

		genere = Math.floor(Math.random() * (29 - 1 + 1)) + 1 // according to wiki


		// add to dataset
		rows.push({
						rating: rating, 
						age: age, 
						price: price,
						id: id,
						pages_no: pages_no,
						readers_no: readers_no,
						genere: genere
				})
	}// for
	return rows
}


module.exports = {

					generateBookDataset: generateBookDataset,
				}