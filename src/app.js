import {loadCurrentWeather, load3DayForecast, loadHourlyForecast, loadBackgroundImage} from './dom';

export { getForecast, onLoad };
// onLoad
async function getForecast(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=668f1b7cfe154b44b6f30756230609&q=${location}&days=3`, {mode: 'cors'});
    const data = await response.json();
    return data;
}

function onLoad() {
    const weatherData = getForecast('london');
    weatherData.then(weather => {
        loadCurrentWeather(weather);
        loadBackgroundImage(weather.current);
        load3DayForecast(weather.forecast);
        loadHourlyForecast(weather);
    });
}

