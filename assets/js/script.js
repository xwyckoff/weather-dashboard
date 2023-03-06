const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
let history = [];
let today = dayjs();
let cityEl = document.querySelector("#cityName");
let tempEl = document.querySelector("#temp");
let windEl = document.querySelector("#wind");
let humidEl = document.querySelector("#humidity");
let currentIcon = document.querySelector("#wicon")


//function that will set the HTML elements to the current weather conditions of the given city name
function getWeatherCurrent(city){
    //first passes the city name into a fetch to get the latitude and longitude of the city
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
        //uses the latitude and longitude in a fetch for the current weather
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + data[0].lat + "&lon=" + data[0].lon + "&units=imperial&appid=" + apiKey)
        .then(response => response.json())
        .then(data => {
            //take the current weather data and display it on the page
            console.log(data);
            cityEl.textContent = data.name + " (" + today.format('MM/DD/YYYY') + ")";
            tempEl.textContent = "Temp: " + data.main.temp + "°F";
            windEl.textContent = "Wind: " + data.wind.speed + " MPH";
            humidEl.textContent = "Humidity: " + data.main.humidity + "%"
            currentIcon.src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            
        })
    });
}

getWeatherCurrent("Columbus");