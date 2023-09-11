import { format } from 'date-fns';
import { getForecast } from './app';


const searchLocationBTN = document.getElementById('search-location');
searchLocationBTN.addEventListener('click' , () => {
    const location = document.getElementById('location-input').value;
    const weatherData = getForecast(location);
    weatherData.then(weather => {
        loadCurrentWeather(weather);
    });
});

function loadCurrentWeather(weather) {
    const locationSpan = document.querySelector('#location > span');
    locationSpan.textContent = `${weather.location.name}, ${weather.location.region}`;
    
    const lastUpdatedDiv = document.querySelector('#location > div');
    lastUpdatedDiv.textContent = `Last updated: ${format(new Date(weather.current.last_updated), 'K:mm bbbb')}`;

    const tempDiv = document.getElementById('temp');
    tempDiv.textContent = `${weather.current.temp_f}\u00B0`;

    const conditionDiv = document.getElementById('condition');
    conditionDiv.innerHTML = `<img src="${weather.current.condition.icon}" alt="condition icon" class="condition-icon"> ${weather.current.condition.text}`;

    const highestTempSpan = document.getElementById('highest-temp');
    highestTempSpan.innerHTML = `<img src="../src/arrow-up-thin.png" alt="Arrow pointing up" class="icon">${weather.forecast.forecastday[0].day.maxtemp_f}\u00B0F`;
    
    const lowestTempSpan = document.getElementById('lowest-temp');
    lowestTempSpan.innerHTML = `<img src="../src/arrow-down-thin.png" alt="Arrow pointing down" class="icon">${weather.forecast.forecastday[0].day.mintemp_f}\u00B0F`;

    const feelsLikeDiv = document.getElementById('feels-like');
    feelsLikeDiv.innerHTML = `<img src="../src/human-handsup.png" alt="Human with hands up" class="icon">${weather.current.feelslike_f}\u00B0`;

    const chanceOfRain = document.getElementById('chance-of-rain');
    chanceOfRain.innerHTML = `<img src="../src/umbrella.png" alt="Umbrella icon" class="icon">${weather.forecast.forecastday[0].day.daily_chance_of_rain}`;
}
