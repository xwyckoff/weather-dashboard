const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
let history = [];

//function that will return the current weather given a city name
function getWeatherCurrent(city){
    //first passes the city name into a fetch to get the latitude and longitude of the city
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
        //uses the latitude and longitude in a fetch for the current weather
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + data[0].lat + "&lon=" + data[0].lon + "&units=imperial&appid=" + apiKey)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    });
}

// getWeatherCurrent("Columbus").then(coords => {
//     console.log(coords.lat + ", " + coords.lon);
// });

getWeatherCurrent("Columbus");