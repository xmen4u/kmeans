var fs = require('fs'),
	Book = require('models/Book.js'),
	file_name,
	file,
	vectors,
	i = 1,
	vec_len

file_name = process.argv[2] // file name to put put

file      = fs.createWriteStream(file_name)
file.on('error', function(err) { console.log(err) /* error handling */ })
file.on('end', function(e){ if (!e) console.log('finished writing!')})
vectors   = Book.generateBookDataset(1000)
vec_len   = vectors.length

vectors.forEach(function(v) { 
								var vec = [v.id, v.price, v.rating, v.genere, v.age, v.pages_no, v.readers_no]
								file.write(JSON.stringify(vec) + '\n')
								console.log('wrote: [' + i++ + '/' + vec_len + ']')
								//file.write(JSON.stringify(v) + '\n') 

				})
file.end()
