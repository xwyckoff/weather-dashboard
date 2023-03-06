const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';
let history = [];
let today = dayjs();
let cityEl = document.querySelector("#cityName");
let tempEl = document.querySelector("#temp");
let windEl = document.querySelector("#wind");
let humidEl = document.querySelector("#humidity");
//let currentIcon = document.querySelector("#wicon");
let searchBar = document.querySelector("#searchBar");
let forecastSection = document.querySelector("#forecast");


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
            let currentIcon = document.createElement("img");
            cityEl.textContent = data.name + " (" + today.format('MM/DD/YYYY') + ")";
            tempEl.textContent = "Temp: " + data.main.temp + "°F";
            windEl.textContent = "Wind: " + data.wind.speed + " MPH";
            humidEl.textContent = "Humidity: " + data.main.humidity + "%"
            //gets weather icon from openweathermap using the provided icon code and add it to the city name
            currentIcon.src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            cityEl.append(currentIcon);
            
        })
    });
}


//function that will create HTML elements for a 5 day forcast
function getWeatherFiveDay(city){
    forecastSection.innerHTML = "";
    //first passes the city name into a fetch to get the latitude and longitude of the city
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(response => response.json())
    .then(data => {
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + data[0].lat + "&units=imperial&lon=" + data[0].lon + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => {
            //create an element for every 8th item in the list of forecasts given (every 8th item is midnight every day in the forecast)
            //have to start at the third element to the five day forecast due to dayjs being in GMT timezone for some reason
            console.log(data);
            for(let i=2; i < data.list.length; i += 8){
                let currentDay = data.list[i];
                //create the card element
                let card = document.createElement("div");
                card.classList.add("card");
                card.classList.add("bg-dark");
                card.classList.add("text-white")
                card.classList.add("col-2");
                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                card.append(cardBody)
                let cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-header");
                cardTitle.innerText = dayjs.unix(currentDay.dt).format('MM/DD/YYYY');
                cardBody.append(cardTitle);
                let cardIcon = document.createElement("img");
                cardIcon.setAttribute("src", "http://openweathermap.org/img/w/" + currentDay.weather[0].icon + ".png");
                cardBody.append(cardIcon);
                let cardTemp = document.createElement("p");
                cardTemp.classList.add("card-text")
                cardTemp.innerText = "Temp: " + currentDay.main.temp + "°F"
                cardBody.append(cardTemp);
                let cardWind = document.createElement("p");
                cardWind.classList.add("card-text")
                cardWind.innerText = "Wind: " + currentDay.wind.speed + " MPH";
                cardBody.append(cardWind);
                let cardHumid = document.createElement("p");
                cardHumid.classList.add("card-text")
                cardHumid.innerText = "Humidity: " +  currentDay.main.humidity + "%";
                cardBody.append(cardHumid);
                forecastSection.append(card);

            }
        })
    })
}

function getCityName(){
    getWeatherCurrent(searchBar.value);
    getWeatherFiveDay(searchBar.value);
}