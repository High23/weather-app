export { getForecast  };
// onLoad
async function getForecast(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=668f1b7cfe154b44b6f30756230609&q=${location}&days=3`, {mode: 'cors'});
    const data = await response.json();
    return data;
}
/*

function onLoad() {
    const weatherData = getForecast('london');
    weatherData.then(weather => {
        console.log(weather.current);
    });
    weatherData.then(weather => {
        console.log(weather.forecast);
    });
}

*/
