const apiKey = '3071f4efefdbaf985923f0236b6da1c3';
let today = dayjs();
let cityEl = document.querySelector("#cityName");
let tempEl = document.querySelector("#temp");
let windEl = document.querySelector("#wind");
let humidEl = document.querySelector("#humidity");
let searchBar = document.querySelector("#searchBar");
let forecastSection = document.querySelector("#forecast");
let historySection = document.querySelector("#history");
let historyList = [];

//function that will set the HTML elements to the current weather conditions of the given city name
function getWeatherCurrent(city){
    //first passes the city name into a fetch to get the latitude and longitude of the city
    fetch(`https://geocode.maps.co/search?q={${city}}`)
    .then(response => response.json())
    .then(data => {
            //uses the latitude and longitude in a fetch for the current weather
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + data[0].lat + "&lon=" + data[0].lon + "&units=imperial&appid=" + apiKey)
            .then(response => response.json())
            .then(data => {
                
                //take the current weather data and display it on the page
                addToHistory(data.name);
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
            for(let i=2; i < data.list.length; i += 8){
                let currentDay = data.list[i];
                //create the card element
                let card = document.createElement("div");
                card.classList.add("card", "bg-dark", "text-white", "col-2");
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

//function to add a given city name to the localStorage
function addToHistory(city){
    if(!historyList.includes(city)){
        historyList.push(city);
        createHistoryButton(city);
        localStorage.setItem("cityName", JSON.stringify(historyList));
    }
}

//function to populate the history section
function populateHistory(){
    //populates list of searched cities, creates it as a set to remove any duplicates
    historySection.innerHTML = "<h2>History</h2>";
    //checks if the item exists in localStorage, if not, it sets the array to empty
    JSON.parse(localStorage.getItem("cityName")) ? historyList = JSON.parse(localStorage.getItem("cityName")) : historyList = [];
    historyList.forEach(city => {
        createHistoryButton(city);
    });

}


//function to create button for search history
function createHistoryButton(city){
    let historyButton = document.createElement("button");
    historyButton.classList.add("btn", "btn-secondary", "w-25", "col-2", "mb-2");
    historyButton.textContent = city;
    historyButton.addEventListener("click", () =>{
        getWeatherCurrent(historyButton.textContent);
        getWeatherFiveDay(historyButton.textContent);
    })
    historySection.append(historyButton);
    historySection.append(document.createElement("br"));
}

function getCityName(){
    getWeatherCurrent(searchBar.value);
    getWeatherFiveDay(searchBar.value);
}