const cityInput = document.querySelector('.input-city');
const searchBtn = document.querySelector('.searchBtn');

const weatherCity = document.querySelector(`.weather-city`);
const notFound = document.querySelector(`.not-found`);
const searchCity = document.querySelector(`.search-city`);

const weatherSummaryImg = document.querySelector(`.weather-icon`);
const CurrentTimeDate = document.querySelector(`.current-date-text`);

const cityText = document.querySelector('.city-text');
const tempText = document.querySelector('.temperature');
const conditionText = document.querySelector('.description');


const windSpeed = document.querySelector('.wind-value-text');
const humidityText = document.querySelector('.humidity-value-text');
const chanceTxt = document.querySelector('.chance-value-text');

const forecastItemsContainer = document.querySelector('.forecast-container');

const apiKey = '3abd0415e9e5b621e254b35d5157f756';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id){
    if(id <= 232) return 'stormy.png';
    if(id <= 321) return 'windy.png';
    if(id <= 531) return 'rainy.png';
    if(id <= 622) return 'snowy.png';
    if(id <= 781) return 'atmosphere.png';
    if(id <= 800) return 'atmosphere.png';
    else return 'cloudy.png'


    
}

function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {

    const weatherData = await getFetchData('weather', city);
    const forecastData = await getFetchData('forecast', city);


    if (weatherData.cod != 200 || forecastData.cod != 200) {
        showDisplaySection(notFound);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
        rain: {'1h': rainVolume } = {'1h': 0}
    } = weatherData;


    cityText.textContent = country;
    tempText.textContent = Math.round(temp) + ' °C';
    conditionText.textContent = main;

    windSpeed.textContent = speed + 'M/s';
    humidityText.textContent = humidity + '%';
    chanceTxt.textContent = rainVolume + '%';

    weatherSummaryImg.src = `weather/${getWeatherIcon(id)}`;
    CurrentTimeDate.textContent = getCurrentDate();

    await updateForecastsInfo(city);

    showDisplaySection(weatherCity);
}

async function updateForecastsInfo(city){
    const forecastData = await getFetchData(`forecast`, city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];



    forecastItemsContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastWeather);
        }
    });

}

function updateForecastsItems(weatherData){
    console.log(weatherData);

    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp},


    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
            <div class="forecast-items">
                <h5 class="forecast-item-date sub-text"> ${dateResult}</h5>
                <img src="weather/${getWeatherIcon(id)}" class="forecast-item-icon" width="110px" height="110px" alt="forecast icon">
                <h5 class="forecast-item-temperature">${Math.round(temp)} °C</h5>
            </div> 
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDisplaySection(section) {
    [weatherCity, searchCity, notFound].forEach(s => s.style.display = 'none');
    

    section.style.display = 'block'; 
}