import { format } from 'date-fns';
import { getForecast } from './app';


const searchLocationBTN = document.getElementById('search-location');
searchLocationBTN.addEventListener('click' , () => {
    const location = document.getElementById('location-input').value;
    const weatherData = getForecast(location);
    weatherData.then(weather => {
        loadCurrentWeather(weather);
        load3DayForecast(weather.forecast);
        loadHourlyForecast(weather);
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

function load3DayForecast(forecast) {
    const todayDateDiv = document.querySelector('.today > div:nth-child(2)');
    const todayIconDiv = document.querySelector('.today > img');
    const todayConditionDiv = document.querySelector('.today > div:last-child');

    todayDateDiv.textContent = format(new Date(forecast.forecastday[0].date), 'MM/dd');
    todayIconDiv.src = forecast.forecastday[0].day.condition.icon;
    todayConditionDiv.textContent = forecast.forecastday[0].day.condition.text;
    const tomorrowDayName = document.querySelector('.tomorrow > div:nth-child(1)');
    const tomorrowDateDiv = document.querySelector('.tomorrow > div:nth-child(2)');
    const tomorrowIconDiv = document.querySelector('.tomorrow > img');
    const tomorrowConditionDiv = document.querySelector('.tomorrow > div:last-child');

    tomorrowDayName.textContent = format(new Date(forecast.forecastday[1].date), 'eee');
    tomorrowDateDiv.textContent = format(new Date(forecast.forecastday[1].date), 'MM/dd');
    tomorrowIconDiv.src = forecast.forecastday[1].day.condition.icon;
    tomorrowConditionDiv.textContent = forecast.forecastday[1].day.condition.text;

    const dayAfterTmrwDayName = document.querySelector('.day-after-tomorrow > div:nth-child(1)');
    const dayAfterTmrwDateDiv = document.querySelector('.day-after-tomorrow > div:nth-child(2)');
    const dayAfterTmrwIconDiv = document.querySelector('.day-after-tomorrow > img');
    const dayAfterTmrwConditionDiv = document.querySelector('.day-after-tomorrow > div:last-child');

    dayAfterTmrwDayName.textContent = format(new Date(forecast.forecastday[2].date), 'eee');
    dayAfterTmrwDateDiv.textContent = format(new Date(forecast.forecastday[2].date), 'MM/dd');
    dayAfterTmrwIconDiv.src = forecast.forecastday[2].day.condition.icon;
    dayAfterTmrwConditionDiv.textContent = forecast.forecastday[2].day.condition.text;
}

function loadHourlyForecast(weatherData) {
    const allHourDetailsDivs = document.getElementsByClassName('hour-details');
    const currentHourForLocation = format(new Date(weatherData.location.localtime), 'H');
    weatherData.forecast.forecastday[0].hour.splice(0, currentHourForLocation);

    const currentDayHours = weatherData.forecast.forecastday[0].hour;
    currentDayHours.forEach((hour, index) => {
        const hourIMG = allHourDetailsDivs[index].childNodes[3];
        const hourTempSpan = allHourDetailsDivs[index].childNodes[5];
        if (index === 0) {
            hourIMG.src = hour.condition.icon;
            hourTempSpan.textContent = `${hour.temp_f}\u00B0`;
        } else {
            const hourSpan = allHourDetailsDivs[index].childNodes[1];
            hourSpan.textContent = format(new Date(hour.time), 'h aa');
            hourIMG.src = hour.condition.icon;
            hourTempSpan.textContent = `${hour.temp_f}\u00B0`;
        }
    });
    
    if (!(currentDayHours.length === 24)) {
        const nextDayHours = weatherData.forecast.forecastday[1].hour.splice(0, currentHourForLocation);
        for (let i = 0; i < nextDayHours.length; i++) {
            const hourSpan = allHourDetailsDivs[currentDayHours.length + i].childNodes[1];
            const hourIMG = allHourDetailsDivs[currentDayHours.length + i].childNodes[3];
            const hourTempSpan = allHourDetailsDivs[currentDayHours.length + i].childNodes[5];
            hourSpan.textContent = format(new Date(nextDayHours[i].time), 'K aa');
            hourIMG.src = nextDayHours[i].condition.icon;
            hourTempSpan.textContent = `${nextDayHours[i].temp_f}\u00B0`;
        }
    } 
} 


const hoursDiv = document.querySelector('.hours');
const dots = document.querySelectorAll('.slider > .dots');
const forwardBTN = document.getElementById('forward');
forwardBTN.addEventListener('click', () => {
    if ( hoursDiv.classList[2] === 'forward2' ) {
        hoursDiv.classList.remove('forward');
        hoursDiv.classList.remove('forward2');
        dots[2].classList.remove('filled');
        dots[0].classList.add('filled');
    } else if (hoursDiv.classList[1] === 'forward') {
        hoursDiv.classList.add('forward2');
        dots[1].classList.remove('filled');
        dots[2].classList.add('filled');
    } else {
        hoursDiv.classList.add('forward');
        dots[0].classList.remove('filled');
        dots[1].classList.add('filled');
    }
});

const backBTN = document.getElementById('back');
backBTN.addEventListener('click', () => {
    if (hoursDiv.classList[2] === 'forward2') {
        hoursDiv.classList.remove('forward2');
        dots[2].classList.remove('filled');
        dots[1].classList.add('filled');
    } else if (hoursDiv.classList[1] === 'forward') {
        hoursDiv.classList.remove('forward');
        dots[1].classList.remove('filled');
        dots[0].classList.add('filled');
    } else {
        hoursDiv.classList.add('forward');
        hoursDiv.classList.add('forward2');
        dots[0].classList.remove('filled');
        dots[2].classList.add('filled');
    }
});
