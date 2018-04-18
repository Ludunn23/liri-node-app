require('dotenv').config();
var keys = require('./key.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

// var spotifyKey = new Spotify(keys.spotify);


//Arguments
var argOne = process.argv;
var command = process.argv[2];
var search = process.argv[3];

//movie or song
var x = "";

//attaches multiple word arguments
for (var i = 3; i < argOne.length; i++) {
    if (i > 3 && i < argOne.length) {
        x = x + "+" + argOne[i];
    }
    else {
        x = x + argOne[i];
    }
}

switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (search) {
            spotifySong(search);
        } else {
            spotifySong("The Sign by Ace of Base");
        }
        break;

    case "movie-this":
        if (x) {
            omdbData(x)
        } else {
            omdbData("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}


function showTweets() {

    var client = new Twitter(keys.twitter);
    var screenName = { screen_name: 'SmackeeChan' };

    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@SmackeeChan: " + tweets[i].text + " Created At: " + date);
                console.log("-----------------------");

                //adds text to log.txt file
                fs.appendFile('log.txt', "@SmackeeChan: " + tweets[i].text + " Created At: " + date);
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error occurred');
        }
    });
}




function spotifySong(song) {

    var spotifyKey = new Spotify(keys.spotify);
    // console.log(spotifyKey);
spotifyKey.search({
        type: 'track',
        query: song
    },
        function (error, data) {
                // console.log(data.tracks.items);


            if (!error) {
                for (var i = 0; i < data.tracks.items.length; i++) {
                    var songData = data.tracks.items[i];
                    console.log("Artist: " + songData.artists[0].name);
                    console.log("Song: " + songData.name);
                    console.log("Preview URL: " + songData.preview_url);
                    console.log("Album: " + songData.album.name);
                    console.log("-----------------------");

                    //adds text to log.txt
                    fs.appendFileSync('log.txt', songData.artists[0].name);
                    fs.appendFileSync('log.txt', songData.name);
                    fs.appendFileSync('log.txt', songData.preview_url);
                    fs.appendFileSync('log.txt', songData.album.name);
                    fs.appendFileSync('log.txt', "-----------------------");
                }
            }
        }
    )
}
function omdbData(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true&apikey=trilogy';

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);


            //adds text to log.txt
            fs.appendFileSync('log.txt', "Title: " + body.Title);
            fs.appendFileSync('log.txt', "Release Year: " + body.Year);
            fs.appendFileSync('log.txt', "IMdB Rating: " + body.imdbRating);
            fs.appendFileSync('log.txt', "Country: " + body.Country);
            fs.appendFileSync('log.txt', "Language: " + body.Language);
            fs.appendFileSync('log.txt', "Plot: " + body.Plot);
            fs.appendFileSync('log.txt', "Actors: " + body.Actors);

        } else {
            console.log('Error occurred.')
        }
        if (movie === "Mr. Nobody") {
            console.log("-----------------------");


            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------");
        }
    });

}

function doThing() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var thing = data.split(',');

        spotifySong(thing[1]);
    });
}
