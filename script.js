// ============================================
// MODERN WEATHER WEBPAGE JAVASCRIPT
// ============================================

const API_KEY = '833261a7f072fc10ae775dc08a82e0b5';
const DEFAULT_CITY = 'Agartala';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const statusMessage = document.getElementById('status-message');
const weatherCardContainer = document.getElementById('weather-card-container');

// Helpful aliases for capitals whose official names differ from API results
const cityAliasMap = {
    amaravati: { query: 'Vijayawada', display: 'Amaravati' },
    bengaluru: { query: 'Bangalore', display: 'Bengaluru' },
    dispur: { query: 'Guwahati', display: 'Dispur' },
    pondicherry: { query: 'Puducherry', display: 'Puducherry' },
    puducherry: { query: 'Puducherry', display: 'Puducherry' },
    panaji: { query: 'Panaji', display: 'Panaji' },
    newdelhi: { query: 'New Delhi', display: 'New Delhi' },
    portblair: { query: 'Port Blair', display: 'Port Blair' }
};

const weatherIcons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '💨',
    Dust: '🌪️'
};

function formatCityName(value) {
    return value
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function resolveCity(cityInput) {
    const trimmed = cityInput.trim();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/\s+/g, '').toLowerCase();
    if (cityAliasMap[normalized]) {
        return cityAliasMap[normalized];
    }

    return {
        query: trimmed,
        display: formatCityName(trimmed)
    };
}

function setStatus(message = '', type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type}`;
}

function getWeatherIcon(condition) {
    if (!condition) return '🌤️';
    return weatherIcons[condition] || '🌤️';
}

function renderWeatherCard(weather) {
    const updatedAt = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(weather.updatedAt);

    const windKmh = Math.round(weather.windSpeed * 3.6);
    
    // AQI display - make it clickable
    const aqiDisplay = weather.aqi 
        ? `<a href="aqi-info.html" class="aqi-link">AQI: <span id="aqiValue">${weather.aqi}</span> (${getAQILevel(weather.aqi)})</a>`
        : `<a href="aqi-info.html" class="aqi-link">AQI: <span id="aqiValue">N/A</span> (Click for info)</a>`;

    return `
        <article class="weather-card">
            <div class="card-header">
                <h2>${weather.city}</h2>
                <small>Last updated: ${updatedAt}</small>
            </div>
            <div class="weather-conditions">
                <div class="temperature">${weather.temperature}<span>°C</span></div>
                <div>
                    <div class="condition-icon">${getWeatherIcon(weather.condition)}</div>
                    <div class="condition-text">${weather.description}</div>
                </div>
            </div>
            <div class="details-grid">
                <div class="detail-card">
                    <p class="detail-label">Feels like</p>
                    <p class="detail-value">${weather.feelsLike}°C</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Humidity</p>
                    <p class="detail-value">${weather.humidity}%</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Wind Speed</p>
                    <p class="detail-value">${windKmh} km/h</p>
                </div>
                <div class="detail-card">
                    <p class="detail-label">Pressure</p>
                    <p class="detail-value">${weather.pressure} hPa</p>
                </div>
                <div class="detail-card aqi-card">
                    <p class="detail-label">Air Quality</p>
                    <p class="detail-value">${aqiDisplay}</p>
                </div>
            </div>
        </article>
    `;
}

async function requestWeatherData(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},IN&appid=${API_KEY}&units=metric`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please update script.js with your key.');
            }
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            }
            if (response.status === 429) {
                throw new Error('API rate limit reached. Please wait and try again.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Unable to fetch weather right now.');
        }
        return response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Function to fetch Air Quality Index (AQI)
async function requestAQIData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            return null; // Return null if AQI is not available
        }
        return response.json();
    } catch (error) {
        // If AQI fetch fails, return null (not critical)
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Function to get AQI level name
function getAQILevel(aqi) {
    const levels = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
    };
    return levels[aqi] || 'Unknown';
}

async function fetchWeatherForCity(cityInput) {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        setStatus('Please add your OpenWeatherMap API key in script.js (line 5).', 'error');
        weatherCardContainer.innerHTML = '';
        return;
    }

    const city = resolveCity(cityInput);
    if (!city) {
        setStatus('Please enter a city name to search.', 'error');
        return;
    }

    setStatus(`Loading weather for ${city.display}...`, 'info');
    weatherCardContainer.innerHTML = '';

    try {
        const data = await requestWeatherData(city.query);
        
        // Try to fetch AQI data if coordinates are available
        let aqi = null;
        if (data.coord) {
            const aqiData = await requestAQIData(data.coord.lat, data.coord.lon);
            if (aqiData && aqiData.list && aqiData.list[0]) {
                aqi = aqiData.list[0].main.aqi;
            }
        }
        
        const weather = {
            city: city.display,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0]?.main || '',
            description: data.weather[0]?.description || '',
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            aqi: aqi,
            updatedAt: new Date(data.dt * 1000)
        };

        weatherCardContainer.innerHTML = renderWeatherCard(weather);
        setStatus(`Showing latest weather for ${weather.city}.`, 'success');
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherCardContainer.innerHTML = `<p class="error-state">${error.message}</p>`;
        setStatus('', 'info');
    }
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityToSearch = cityInput.value.trim() || DEFAULT_CITY;
    fetchWeatherForCity(cityToSearch);
});

window.addEventListener('load', () => {
    cityInput.value = DEFAULT_CITY;
    fetchWeatherForCity(DEFAULT_CITY);
});
