import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// API keys
const GOOGLE_MAPS_API_KEY = 'AIzaSyC-UhgSwwA7_eWVHFC9bYPIEY2uodyNN70';
const OPENWEATHER_API_KEY = 'd98e082c643e3a18e8b15f0e92c3f35e';

// Map container style
const containerStyle = {
  width: '100%',
  height: '50vh',
};

// Initial map center (default to New York)
const center = {
  lat: 40.7128,
  lng: -74.006,
};

function App() {
  const [weatherData, setWeatherData] = useState(null);     // Stores current weather info 
  const [forecastData, setForecastData] = useState(null);   // Stores 5-day forecast data
  const [compareCities, setCompareCities] = useState([]);   // Stores cities selected for comparison
  const [cityInput, setCityInput] = useState('');           // Keeps track of the city entered by the user
  const [darkMode, setDarkMode] = useState(false); // switch between light & dark mode
  const [weatherCondition, setWeatherCondition] = useState('default-bg'); // Background state

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Fetch weather data from OpenWeather API
  const getWeather = async (lat, lng) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );   // current weather
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );   // Extract unique days for 7-day forecast

      const dailyForecast = {};
      forecastResponse.data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecast[date]) {
          dailyForecast[date] = item;
        }
      });
      setWeatherData(weatherResponse.data);
      setForecastData(Object.values(dailyForecast).slice(0, 7)); // Get 7 unique days

      // Set background based on weather condition
      const condition = weatherResponse.data.weather[0].main;
      setWeatherCondition(getBackgroundClass(condition)); // Update background class
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Fetch weather for multiple cities
  const getCityWeather = async (cityName) => {
    try {
      const cityResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      return cityResponse.data;
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
      return null;
    }
  };

  // Handle city comparison
  const handleCompareCities = async () => {
    const cityNames = cityInput.split(',').map((city) => city.trim());   // Split user input by commas
    const results = await Promise.all(cityNames.map((city) => getCityWeather(city)));  // Fetch weather for all cities
    const validCities = results.filter((city) => city !== null);  // Save valid responses to display
    setCompareCities(validCities);
  };

  // Handle map click to fetch weather
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    getWeather(lat, lng);
  }, []);

  // Prepare data for temperature graph
  const getTemperatureGraphData = () => {
    if (!forecastData) return {};
    const labels = forecastData.map((item) =>
      new Date(item.dt_txt).toLocaleString('en-US', { weekday: 'short' })
    );
    const data = forecastData.map((item) => item.main.temp);
    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  // Get dynamic background class based on weather condition
  const getBackgroundClass = (condition) => {
    switch (condition) {
      case 'Clear':
        return 'clear-bg';
      case 'Clouds':
        return 'cloudy-bg';
      case 'Rain':
        return 'rainy-bg';
      case 'Snow':
        return 'snowy-bg';
      case 'Thunderstorm':
        return 'stormy-bg';
      default:
        return 'default-bg';
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return '☀️'; // Clear sky
      case 'Clouds':
        return '☁️'; // Cloudy
      case 'Rain':
        return '🌧️'; // Rainy
      case 'Snow':
        return '❄️'; // Snow
      case 'Thunderstorm':
        return '⛈️'; // Thunderstorm
      default:
        return '🌤️'; // Default icon
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''} ${weatherCondition}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>

      {/* Map container */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}    // Starts on New York
          zoom={5}
          onClick={handleMapClick}   // Handles user clicks
        />
      </div>

      {/* City Comparison Section */}
      <div className="compare-container">
        <h3>🌍 Compare Weather of Multiple Cities</h3>
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter city names, e.g., London, Paris, Tokyo"
        />
        <button onClick={handleCompareCities}>Compare</button>
      </div>

      {compareCities.length > 0 && (
        <div className="compare-results">
          {compareCities.map((city, index) => (
            <div key={index} className="city-card">
              <h4>{city.name}</h4>
              <p>🌡️ {city.main.temp.toFixed(1)}°C</p>
              <p>💧 {city.main.humidity}% Humidity</p>
              <p>🌬️ {city.wind.speed} m/s Wind</p>
              <p>
                ☁️ {city.weather[0].main}{' '}
                <span role="img" aria-label="icon">
                  {getWeatherIcon(city.weather[0].main)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Weather info section */}
      {weatherData && (
        <div className="weather-info">
          <h3>🌦️ Weather Details</h3>
          <p>📍 Location: {weatherData.name}</p>
          <p>🌡️ Temperature: {weatherData.main.temp}°C</p>
          <p>💧 Humidity: {weatherData.main.humidity}%</p>
          <p>🌬️ Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>
            ☁️ Condition: {weatherData.weather[0].main}{' '}
            <span role="img" aria-label="icon">
              {getWeatherIcon(weatherData.weather[0].main)}
            </span>
          </p>
        </div>
      )}

      {/* Temperature Graph Section */}
      {forecastData && (
        <div className="graph-container">
          <h3>🌡️ Weekly Temperature Forecast</h3>
          <Line data={getTemperatureGraphData()} />
        </div>
      )}
    </div>
  );
}

export default App;
