var fs = require("fs");
var request = require("request");
var action = process.argv[2];
var keys = "";

//Setting up Twitter call
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: '5CdYfwF59SlG2zzV4HX8DX1Pb',
  consumer_secret: 'Qaq9GGMvnO5m3Z0i98Qr6RG4UxClNEjLdME2EJNM2h5xRaPbgC',
  access_token_key: '505025396-0yNVPF2AdAf09LrYkDgypCzHllfNl0JFAUp8CAGn',
  access_token_secret: 'fmFi3BJKmFLwjXaY727efEB1I1c7th1Az6kbNnkw23Qjx'
});

switch(action){
	case "my-tweets":
		tweets();
		break;
	case "spotify-this-song":
		spotify();
		break;
	case "movie-this":
		movie();
		break;
	case "do-what-it-says":
		random();
		break;
}

//my-tweets command
function tweets(){

	//Define screen name parameter
	var params = {screen_name: 'KarlTheFog'};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		//Log 20 most recent tweets from @KarlTheFog if there's no error
	  	if (!error) {
		  	for(var i=0; i<20; i++){
		  		console.log("\nTweet #"+(i+1)+"-------\n" + tweets[i].text + 
		  			"\n\nPosted on: " + tweets[i].created_at + "\n");
		  	}
		  	fs.appendFile('log.txt', '\n--------\nUser entered "my-tweets"');
		}
	});
}

//spotify-this-song command
function spotify(){
	//Setting up Spotify call
	var Spotify = require('node-spotify-api');

	var spotify = new Spotify({
	  id: "8cd3e07007294624ac4c8a420e70c9e0",
	  secret: "dc40df49627045e9ba0214d2019bdbb1"
	});

	var trackArr = process.argv;
	var tempArr = [];

	//Pushes user's song into temporary array
	for(var i = 3; i<trackArr.length; i++){
		tempArr.push(trackArr[i]);
	}
	
	//Concatinates title words from temporary array
	var result = tempArr.join("+");
					
	
	//If user doesn't give a song title, default to "The Sign"
	if (result === ''){
		spotify.search({ type: 'track', query: 'The Sign' }, function(error, data) {
			if (error) {
				return console.log('Error occurred: ' + error);
			}
			else{
				console.log("Song: " + data.tracks.items[0].name + 
					"\nArtist: "+data.tracks.items[0].artists[0].name +
					"\nAlbum: "+data.tracks.items[0].album.name +
					"\nLink: "+data.tracks.items[0].preview_url);
			}
		})
	}
	//If user gives a song title, log its title, artist, album, and preview link
	else {
		spotify.search({ type: 'track', query: result }, function(error, data) {
			if (error) {
				return console.log('Error occurred: ' + error);
			}
			else{
				console.log("Song: " + data.tracks.items[0].name + 
					"\nArtist: "+data.tracks.items[0].artists[0].name +
					"\nAlbum: "+data.tracks.items[0].album.name +
					"\nLink: "+data.tracks.items[0].preview_url);
				fs.appendFile('log.txt', '\n--------\nUser entered "spotify-this-song" '+result+' and logged:\n'+
					"Song: " + data.tracks.items[0].name + 
					"\nArtist: "+data.tracks.items[0].artists[0].name +
					"\nAlbum: "+data.tracks.items[0].album.name +
					"\nLink: "+data.tracks.items[0].preview_url);
			}
		})
	}
}


//movie-this command
function movie() {
	//Store arguments in an array
	var movieArr = process.argv;

	//Store movie name in empty array
	var tempArr = [];

	//Pushes user's movie into temporary array
	for(var i = 3; i < movieArr.length; i++){
			tempArr.push(movieArr[i]);
	}

	//Concatinates movie name with multiple words
	var movieName = tempArr.join('+');

	//Define the OMDB Query URL
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {
		//If there's no error and the response code is 200, log the movie info
		if(!error && response.statusCode===200){
			var results = JSON.parse(body);
			var displayResults = 'Title: ' + results.Title +
				'\nYear: ' + results.Year + 
				'\nIMDB Rating: ' + results.imdbRating + 
				'\nRotten Tomatoes Rating: ' + results.Ratings[1].Value +
				'\nCountry of Origin: ' + results.Country +
				'\nLanguage: ' + results.Language +
				'\nPlot: ' + results.Plot +
				'\nActors: ' + results.Actors;

			console.log(displayResults);
			fs.appendFile('log.txt', '\n--------\nUser entered "movie-this" '+movieName+' and logged:\n'+displayResults);
		}
		else{
			console.log(error);
		}
	})
}

//do-what-it-says command (aka random.txt)
function random(){
	var Spotify = require('node-spotify-api');

	var spotify = new Spotify({
	  id: "8cd3e07007294624ac4c8a420e70c9e0",
	  secret: "dc40df49627045e9ba0214d2019bdbb1"
	});
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error){
			console.log(error);
		}
		else{
			console.log(data);

			var dataArr = data.split(",");
			// console.log(dataArr);
			var dataSlice = dataArr[1].slice(1, -1);
			// console.log(dataSlice);

			spotify.search({ type: 'track', query: dataSlice }, function(error, data){
				if (error) {
					return console.log('Error occurred: ' + error);
				}
				else{
					console.log("Song: " + data.tracks.items[0].name);
					console.log("Artist: " + data.tracks.items[0].artists[0].name);
					console.log("Album: " + data.tracks.items[0].album.name);
					console.log("Link: " + data.tracks.items[0].preview_url);
				}
			});
		}
	})
	fs.appendFile('log.txt', '\n--------\nUser entered "do-what-it-says"\n');
};
