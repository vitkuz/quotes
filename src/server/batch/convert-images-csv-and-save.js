var csv = require('csv');
var Az = require('az');
var fs = require('fs');
var path = require('path');
var data = fs.readFileSync(path.join(__dirname, '../files/movies/export_movies (1).csv'));


var customHeaders = ['title', 'movie_en_title','movie_slogan','movie_description','movie_comment', 'movie_category', 'movie_poster', 'movie_year', 'movie_youtube'];
var collection = [];
csv.parse(data, function(err, data){
    data.map(function(value, i){
        console.log('------------------');
        var object = {};
        if (i === 0) {
            // headers = value;
        } else {
            value.forEach((x,j) => {
                // console.log(customHeaders[j]+': ',x);
                if (j === 5) {
                    let terms = x.split(',');

                    if (terms.length > 1) {
                        console.log('>1');
                        object[customHeaders[j]] = terms.map( (term) => {
                            if (term) {
                                return term.replace(/\s+/, "");
                            } else {
                                return [];
                            }
                        });
                    } else {
                        object[customHeaders[j]] = x;
                    }

                } else {
                    object[customHeaders[j]] = x;
                }


            })
        }
        collection.push(object);
    });

    saveToFile(collection);
});

function saveToFile(data) {

    console.log("SAVING FILE");

    console.log(data);

    var filePath = './src/server/files/movies/movies-converted.json';

    fs.writeFile(
        filePath,

        JSON.stringify(data),

        function (err) {
            if (err) {
                console.log('Crap happens',err);
            }
        }
    );
}