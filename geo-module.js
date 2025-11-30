// ============================================
// GEOMODULE - TRIPURA MAP WITH WEATHER & AQI
// ============================================

// API Key - using the same key from main script
const API_KEY = '833261a7f072fc10ae775dc08a82e0b5';

// City markers data for Tripura
const cities = [
    {
        name: 'Agartala',
        coords: [23.8315, 91.2868],
        queryName: 'Agartala'
    },
    {
        name: 'Udaipur',
        coords: [23.53, 91.48],
        queryName: 'Udaipur'
    },
    {
        name: 'Dharmanagar',
        coords: [24.3667, 92.1667],
        queryName: 'Dharmanagar'
    },
    {
        name: 'Kailashahar',
        coords: [24.33, 92.0167],
        queryName: 'Kailashahar'
    }
];

// Initialize map when page loads
let map;

// Tripura boundary coordinates (approximate polygon)
const tripuraBoundary = [
    [24.5, 91.0],
    [24.5, 92.5],
    [23.0, 92.5],
    [23.0, 91.0],
    [24.5, 91.0]
];

let tripuraHighlightLayer;

// Initialize the Leaflet map
function initMap() {
    // Create map focused on East/Northeast India region with full interaction enabled
    // Shows: East India, Northeast India, Myanmar, Bay of Bengal, Bhutan, Nepal, Tibet
    // Constrained to only show the specified region - no world map, no wrapping
    map = L.map('map', {
        center: [24.0, 90.0], // Center point to frame the specified region
        zoom: 7, // Zoom level to show only the specified region
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        minZoom: 5, // Prevent zooming out beyond the allowed region
        maxZoom: 19,
        maxBounds: [[5, 80], [30, 101]], // Constrain to: East India, Northeast India, Myanmar, Bay of Bengal, Bhutan, Eastern Nepal, Adjacent southern China
        worldCopyJump: false // Prevent map wrapping
    });

    // Add OpenStreetMap tile layer with no wrapping
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        noWrap: true,
        continuousWorld: false,
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Highlight Tripura with border and glow
    highlightTripura();

    // Add markers for each city in Tripura
    cities.forEach(city => {
        addCityMarker(city);
    });
}

// Highlight Tripura region
function highlightTripura() {
    // Create a polygon to highlight Tripura
    tripuraHighlightLayer = L.polygon(tripuraBoundary, {
        color: '#ff6b35',
        weight: 3,
        fillColor: '#ff6b35',
        fillOpacity: 0.15,
        dashArray: '10, 5'
    }).addTo(map);

    // Add glow effect using multiple layers
    L.polygon(tripuraBoundary, {
        color: '#ff6b35',
        weight: 5,
        fillColor: '#ff6b35',
        fillOpacity: 0.05,
        opacity: 0.3
    }).addTo(map);

    // Add label
    L.marker([23.8, 91.7]).addTo(map)
        .bindTooltip('Tripura (Active Region)', {
            permanent: true,
            direction: 'center',
            className: 'tripura-label'
        });
}

// Add a marker for a city
function addCityMarker(city) {
    // Create a custom icon (optional - using default for simplicity)
    const marker = L.marker(city.coords).addTo(map);

    // Add click event to fetch weather and AQI data
    marker.on('click', async function() {
        await showCityPopup(marker, city);
    });

    // Add a simple popup that shows loading initially
    marker.bindPopup('<div class="popup-loading">Loading weather data...</div>', {
        maxWidth: 300
    });
}

// Show popup with weather data only (no AQI)
async function showCityPopup(marker, city) {
    // Show loading state
    const loadingContent = '<div class="popup-loading">Loading weather data...</div>';
    marker.setPopupContent(loadingContent).openPopup();

    try {
        // Fetch weather data only
        const weatherData = await fetchWeatherData(city.queryName, city.coords);
        
        // Fetch AQI data for the popup
        const aqiData = await fetchAQIData(city.coords);

        // Create compact popup content
        const popupContent = createCompactPopupContent(city.name, weatherData, aqiData);
        
        // Update popup
        marker.setPopupContent(popupContent).openPopup();
    } catch (error) {
        console.error('Error fetching data:', error);
        const errorContent = `<div class="popup-error">Error loading data: ${error.message}</div>`;
        marker.setPopupContent(errorContent).openPopup();
    }
}

// Fetch weather data from OpenWeather Current Weather API
async function fetchWeatherData(cityName, coords) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},IN&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                // If city name not found, try with coordinates
                return await fetchWeatherByCoords(coords);
            }
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0]?.main || 'Unknown',
            description: data.weather[0]?.description || 'N/A',
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind?.speed || 0,
            windDirection: data.wind?.deg || 0,
            visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A',
            icon: data.weather[0]?.icon || ''
        };
    } catch (error) {
        // Fallback to coordinate-based fetch
        return await fetchWeatherByCoords(coords);
    }
}

// Fetch weather by coordinates (fallback)
async function fetchWeatherByCoords(coords) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0]?.main || 'Unknown',
            description: data.weather[0]?.description || 'N/A',
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind?.speed || 0,
            windDirection: data.wind?.deg || 0,
            visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A',
            icon: data.weather[0]?.icon || ''
        };
}

// Fetch AQI data from OpenWeather Air Pollution API
async function fetchAQIData(coords) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords[0]}&lon=${coords[1]}&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // If AQI API fails, return null (not critical)
            return null;
        }
        
        const data = await response.json();
        
        if (data.list && data.list[0]) {
            const aqi = data.list[0].main.aqi;
            const components = data.list[0].components;
            
            return {
                aqi: aqi,
                aqiLevel: getAQILevelName(aqi),
                pm25: components.pm2_5 || 'N/A',
                pm10: components.pm10 || 'N/A',
                no2: components.no2 || 'N/A',
                o3: components.o3 || 'N/A'
            };
        }
        
        return null;
    } catch (error) {
        console.error('AQI fetch error:', error);
        return null;
    }
}

// Get AQI level name
function getAQILevelName(aqi) {
    const levels = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
    };
    return levels[aqi] || 'Unknown';
}

// Fetch forecast data
async function fetchForecastData(coords) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        
        const data = await response.json();
        return {
            hourly: data.list?.slice(0, 8) || [], // Next 24 hours (3-hour intervals)
            daily: data.list?.filter((item, index) => index % 8 === 0).slice(0, 7) || [] // 7-day forecast
        };
    } catch (error) {
        console.error('Forecast fetch error:', error);
        return null;
    }
}

// Get wind direction from degrees
function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

// Get weather icon URL
function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Create compact popup content with minimal info
function createCompactPopupContent(cityName, weatherData, aqiData) {
    const iconUrl = weatherData.icon ? getWeatherIcon(weatherData.icon) : '';
    const aqiValue = aqiData ? aqiData.aqi : 'N/A';
    const aqiLevel = aqiData ? getAQILevelName(aqiData.aqi) : 'N/A';
    
    let html = `
        <div class="popup-content compact-popup">
            <div class="popup-header">
                ${iconUrl ? `<img src="${iconUrl}" alt="${weatherData.description}" style="vertical-align: middle; margin-right: 8px; width: 32px; height: 32px;">` : ''}
                ${cityName}
            </div>
            <div class="popup-info">
                <div class="popup-item">
                    <span class="popup-label">Temperature:</span>
                    <span class="popup-value">${weatherData.temperature}°C</span>
                </div>
                <div class="popup-item">
                    <span class="popup-label">Condition:</span>
                    <span class="popup-value">${weatherData.description}</span>
                </div>
                <div class="popup-item">
                    <span class="popup-label">AQI:</span>
                    <span class="popup-value">${aqiValue} ${aqiValue !== 'N/A' ? `(${aqiLevel})` : ''}</span>
                </div>
            </div>
            <a href="state-details.html?city=${encodeURIComponent(cityName)}" class="popup-button view-details-btn">View Details</a>
        </div>
    `;

    return html;
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if API key is set
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('Please set your OpenWeatherMap API key in geo-module.js');
        document.getElementById('map').innerHTML = '<div style="padding: 40px; text-align: center; color: #ff4444;">Please configure your API key in geo-module.js</div>';
        return;
    }

    // Initialize the map
    initMap();
});

