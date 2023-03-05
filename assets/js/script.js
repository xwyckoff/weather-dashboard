const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
let history = [];

//function that will return the latitude and longitude given a city name
function getLoc(city){
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then((response) => response.json())

    .then((data) => {
        console.log(data[0].lat + ", " + data[0].lon)
    });
}

getLoc("Columbus");