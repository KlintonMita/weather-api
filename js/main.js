function loadCities() {
    fetch('city_coordinates.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const citySelector = document.getElementById('citySelector');

            lines.forEach((line, index) => {
                if (index === 0) return;
                const [latitude, longitude, city, country] = line.split(',');

                if (latitude && longitude && city && country) {
                    const option = document.createElement('option');
                    option.value = `${latitude.trim()},${longitude.trim()}`;
                    option.textContent = city.trim();
                    citySelector.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error loading cities:', error));
}

function getWeather(coords) {
    const [lat, lon] = coords.split(',');

    const url = `http://www.7timer.info/bin/api.pl?lon=${lon.trim()}&lat=${lat.trim()}&product=astro&output=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const forecastList = document.getElementById('forecast');
            forecastList.innerHTML = ''; 


            const weatherIcons = {
                'clear': './clear.png',
                'cloudy': './cloudy.png',
                'rain': './rain.png',
                'snow': './snow.png',
                'humid': './humid.png',
                'fog': './fog.png',
                'ishower': './ishower.png',
                
            };

            data.dataseries.slice(0, 8).forEach((forecast, index) => {
                const date = new Date();
                date.setHours(date.getHours() + index * 3);

                let weatherCondition = 'clear'; 

                if (forecast.prec_type !== 'none') {
                    weatherCondition = forecast.prec_type;
                } else if (forecast.cloudcover > 6) {
                    weatherCondition = 'cloudy';
                } else if (forecast.cloudcover > 3) {
                    weatherCondition = 'partly_cloudy';
                }

                const weatherIcon = weatherIcons[weatherCondition] || './clear.png';


                const weatherHTML = `<div class="show-weather-body">
                    <div class="show-weather-first">
                        <h2>${date.toLocaleString()}</h2>
                        <img src="./images/${weatherIcon}" alt="weather icon">
                    </div>
                    <div class="show-weather-second">
                        <h3>Temp: ${forecast.temp2m}</h3>
                        <div class="wind-level">
                            <h4>Wind Speed: ${forecast.wind10m.speed}°C</h4>
                            <h4>Wind Direction: ${forecast.wind10m.direction}</h4>
                        </div>
                    </div>
                </div>`;

                forecastList.innerHTML += weatherHTML;
                const body = document.getElementById('body');
                body.style.backgroundRepeat = 'round';
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('forecast').textContent = 'Error loading weather data.';
        });
}

document.getElementById('citySelector').addEventListener('change', function() {
    const coords = this.value;
    if (coords) {
        getWeather(coords);
    } else {
        document.getElementById('forecast').innerHTML = '';
    }
});

window.onload = loadCities;
