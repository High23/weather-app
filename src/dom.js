import { format } from 'date-fns';
import { getForecast } from './app';

export {loadCurrentWeather, load3DayForecast, loadHourlyForecast, loadBackgroundImage}


const searchLocationBTN = document.getElementById('search-location');
searchLocationBTN.addEventListener('click' , () => {
    const location = document.getElementById('location-input').value;
    if (location === '') {
        alert('You forgot to input a city in the search bar!');
        console.error('You must input an existing city name into the search bar!');
        return;
    }
    const weatherData = getForecast(location);
    weatherData.then(weather => {
        loadCurrentWeather(weather);
        loadBackgroundImage(weather.current);
        load3DayForecast(weather.forecast);
        loadHourlyForecast(weather);
    }).catch(err => {
        alert( `${location} is not a valid city name.`);
        console.error(`Oops, you must input a valid city name. You entered '${location}'`);
        console.error(`Here is the error: ${err}`);
    });
});

function loadCurrentWeather(weather, degree='f', windType='mph') {
    const locationSpan = document.querySelector('#location > span');
    locationSpan.textContent = `${weather.location.name}, ${weather.location.region}`;
    locationSpan.setAttribute('data-location', weather.location.name);

    const lastUpdatedDiv = document.querySelector('#location > div');
    lastUpdatedDiv.textContent = `Last updated: ${format(new Date(weather.current.last_updated), 'K:mm bbbb')} (City time)`;

    const tempDiv = document.getElementById('temp');
    const temp = `temp_${degree}`;
    tempDiv.textContent = `${weather.current[[temp]]}\u00B0${degree.toUpperCase()}`;

    const conditionDiv = document.getElementById('condition');
    conditionDiv.innerHTML = `<img src="${weather.current.condition.icon}" alt="condition icon" class="condition-icon"> ${weather.current.condition.text}`;

    const highestTempSpan = document.getElementById('highest-temp');
    const maxTemp = `maxtemp_${degree}`;
    highestTempSpan.innerHTML = `<img src="./icons/arrow-up-thin.svg" alt="Arrow pointing up">${weather.forecast.forecastday[0].day[[maxTemp]]}\u00B0${degree.toUpperCase()}`;
    
    const lowestTempSpan = document.getElementById('lowest-temp');
    const minTemp = `mintemp_${degree}`;
    lowestTempSpan.innerHTML = `<img src="./icons/arrow-down-thin.svg" alt="Arrow pointing down">${weather.forecast.forecastday[0].day[[minTemp]]}\u00B0${degree.toUpperCase()}`;

    const feelsLikeDiv = document.getElementById('feels-like');
    const feelsLikeTemp = `feelslike_${degree}`;
    feelsLikeDiv.innerHTML = `<img src="./icons/human-handsup.svg" alt="Human with hands up" class="icon">${weather.current[[feelsLikeTemp]]}\u00B0`;

    const currentHourForLocation = format(new Date(weather.location.localtime), 'H');
    const chanceOfRain = document.getElementById('chance-of-rain');
    chanceOfRain.innerHTML = `<img src="./icons/umbrella.svg" alt="Umbrella icon" class="icon">${weather.forecast.forecastday[0].hour[currentHourForLocation].chance_of_rain}%`;

    const windDiv = document.getElementById('wind');
    const wind = `wind_${windType}`;
    windDiv.innerHTML = `<img src="./icons/weather-windy.svg" alt="wind icon" class="icon">${weather.current[[wind]]}${windType.toUpperCase()}`;
}

function load3DayForecast(forecast) {
    const todayDateDiv = document.querySelector('.today > div:nth-child(2)');
    const todayIconDiv = document.querySelector('.today > img');
    const todayConditionDiv = document.querySelector('.today > div:last-child');
    const todayDate = forecast.forecastday[0].date.split('-');

    todayDateDiv.textContent = format(new Date(todayDate[0], todayDate[1] - 1, todayDate[2]), 'MM/dd');
    todayIconDiv.src = forecast.forecastday[0].day.condition.icon;
    todayConditionDiv.textContent = forecast.forecastday[0].day.condition.text;

    const tomorrowDayName = document.querySelector('.tomorrow > div:nth-child(1)');
    const tomorrowDateDiv = document.querySelector('.tomorrow > div:nth-child(2)');
    const tomorrowIconDiv = document.querySelector('.tomorrow > img');
    const tomorrowConditionDiv = document.querySelector('.tomorrow > div:last-child');
    const tomorrowDate = forecast.forecastday[1].date.split('-');

    tomorrowDayName.textContent = format(new Date(tomorrowDate[0], tomorrowDate[1] - 1, tomorrowDate[2]), 'eee');
    tomorrowDateDiv.textContent = format(new Date(tomorrowDate[0], tomorrowDate[1] - 1, tomorrowDate[2]), 'MM/dd');
    tomorrowIconDiv.src = forecast.forecastday[1].day.condition.icon;
    tomorrowConditionDiv.textContent = forecast.forecastday[1].day.condition.text;

    const dayAfterTmrwDayName = document.querySelector('.day-after-tomorrow > div:nth-child(1)');
    const dayAfterTmrwDateDiv = document.querySelector('.day-after-tomorrow > div:nth-child(2)');
    const dayAfterTmrwIconDiv = document.querySelector('.day-after-tomorrow > img');
    const dayAfterTmrwConditionDiv = document.querySelector('.day-after-tomorrow > div:last-child');
    const dayAfterTmrwDate = forecast.forecastday[2].date.split('-');

    dayAfterTmrwDayName.textContent = format(new Date(dayAfterTmrwDate[0], dayAfterTmrwDate[1] - 1, dayAfterTmrwDate[2]), 'eee');
    dayAfterTmrwDateDiv.textContent = format(new Date(dayAfterTmrwDate[0], dayAfterTmrwDate[1] - 1, dayAfterTmrwDate[2]), 'MM/dd');
    dayAfterTmrwIconDiv.src = forecast.forecastday[2].day.condition.icon;
    dayAfterTmrwConditionDiv.textContent = forecast.forecastday[2].day.condition.text;
}

function loadHourlyForecast(weatherData, degree='f') {
    const allHourDetailsDivs = document.getElementsByClassName('hour-details');
    const currentHourForLocation = format(new Date(weatherData.location.localtime), 'H');
    weatherData.forecast.forecastday[0].hour.splice(0, currentHourForLocation);
    const temp = `temp_${degree}`;

    const currentDayHours = weatherData.forecast.forecastday[0].hour;
    currentDayHours.forEach((hour, index) => {
        const hourIMG = allHourDetailsDivs[index].childNodes[3];
        const hourTempSpan = allHourDetailsDivs[index].childNodes[5];
        if (index === 0) {
            hourIMG.src = hour.condition.icon;
            hourTempSpan.textContent = `${hour[[temp]]}\u00B0`;
        } else {
            const hourSpan = allHourDetailsDivs[index].childNodes[1];
            hourSpan.textContent = format(new Date(hour.time), 'haa');
            hourIMG.src = hour.condition.icon;
            hourTempSpan.textContent = `${hour[[temp]]}\u00B0`;
        }
    });
    
    if (!(currentDayHours.length === 24)) {
        const nextDayHours = weatherData.forecast.forecastday[1].hour.splice(0, currentHourForLocation);
        for (let i = 0; i < nextDayHours.length; i++) {
            const hourSpan = allHourDetailsDivs[currentDayHours.length + i].childNodes[1];
            const hourIMG = allHourDetailsDivs[currentDayHours.length + i].childNodes[3];
            const hourTempSpan = allHourDetailsDivs[currentDayHours.length + i].childNodes[5];
            hourSpan.textContent = format(new Date(nextDayHours[i].time), 'haa');
            hourIMG.src = nextDayHours[i].condition.icon;
            hourTempSpan.textContent = `${nextDayHours[i][[temp]]}\u00B0`;
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

function loadBackgroundImage(currentWeather) {
    const conditionText = currentWeather.condition.text;
    const creditSpan = document.querySelector('.photo-credit');
    const bodyDiv = document.querySelector('.body');
    bodyDiv.style.backgroundSize = 'cover';

    if (conditionText === 'Sunny') {
        bodyDiv.style.backgroundImage = 'url("./images/sunny.jpg")';
        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@groovelanddesigns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Grooveland Designs</a> 
        on <a href="https://unsplash.com/photos/zjoydJb17mE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    } else if (conditionText === 'Clear') {
        bodyDiv.style.backgroundImage = 'url("./images/clear-night.jpg")';
        bodyDiv.style.color = 'white';
        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@nathananderson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nathan Anderson</a>
         on <a href="https://unsplash.com/photos/L95xDkSSuWw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    } else if (conditionText === 'Partly cloudy') {
        bodyDiv.style.backgroundImage = 'url("./images/partly-cloudy.jpg")';
        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@weilstyle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ethan Weil</a> 
        on <a href="https://unsplash.com/photos/VP4509rcTok?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    } else if (conditionText === 'Cloudy' || conditionText === 'Overcast') {
        bodyDiv.style.backgroundImage = 'url("./images/cloudy.jpg")';
        bodyDiv.style.color = 'white';
        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@riekefischer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Henrieke Fischer</a> 
        on <a href="https://unsplash.com/photos/GCdigLv0h_U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    } else if (conditionText === 'Light rain' || conditionText === 'Moderate rain' || conditionText === 'Light rain shower' || conditionText === 'Patchy light rain with thunder') {
        bodyDiv.style.backgroundImage = 'url("./images/rainy.jpg")';

        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@anant90?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Anant Jain</a> 
        on <a href="https://unsplash.com/photos/Bu1zj2WbjHE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    } else if ( conditionText === 'Heavy rain' || conditionText === 'Moderate or heavy rain shower' || conditionText === 'Moderate or heavy rain with thunder') {
        bodyDiv.style.backgroundImage = 'url("./images/rainy-night.jpg")';
        bodyDiv.style.color = 'white';
        creditSpan.innerHTML = `Photo by 
        <a href="https://unsplash.com/@wackeltin_meem?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Valentin Müller</a> 
        on <a href="https://unsplash.com/photos/bWtd1ZyEy6w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        `;
    }
}

const fahrenheitBTN = document.getElementById('fahrenheit');
fahrenheitBTN.addEventListener('click', () => {
    const location = document.querySelector('#location > span').dataset.location;
    const weatherData = getForecast(location);
    weatherData.then(weather => {
        loadCurrentWeather(weather);
        loadHourlyForecast(weather);
    });
});

const celsiusBTN = document.getElementById('celsius');
celsiusBTN.addEventListener('click', () => {
    const location = document.querySelector('#location > span').dataset.location;
    const weatherData = getForecast(location);
    weatherData.then(weather => {
        loadCurrentWeather(weather, 'c', 'kph');
        loadHourlyForecast(weather, 'c');
    });
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
});