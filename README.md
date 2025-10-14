# 🌦️ Global Weather Application

A **React-based Global Weather App** that displays real-time weather data, 7-day forecasts, and temperature trends using **OpenWeather API** and **Google Maps API**.  
This project was developed as part of my **Big Data Analytics course**, focusing on API integration, real-time data visualization, and building interactive web applications.

---

## 🖼️ Project overview

Global Weather Application is a React-based interactive web app that provides real-time weather information for locations worldwide. Users can view current conditions, 7-day forecasts, and temperature trends through intuitive charts and interactive maps. The app leverages OpenWeather API for weather data and Google Maps API for location selection, offering features like multi-city comparisons, dark mode, and dynamic weather-based backgrounds.


---

## 🚀 Features

- 🗺️ **Interactive Map** – Click anywhere on the map to instantly view live weather data for that location.  
- ☁️ **Real-Time Weather Data** – Displays current temperature, humidity, wind speed, and weather condition.  
- 📆 **7-Day Forecast** – View upcoming temperature trends with easy-to-read charts.  
- 🌆 **Compare Multiple Cities** – Check weather for multiple locations side-by-side.  
- 🌗 **Dark Mode** – Switch between light and dark themes.  
- 🎨 **Dynamic Backgrounds** – The app background changes automatically based on the weather (e.g., sunny, cloudy, rainy).

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React.js (v18+) |
| **APIs** | OpenWeather API, Google Maps JavaScript API |
| **Visualization** | Chart.js (via react-chartjs-2) |
| **HTTP Client** | Axios |
| **Styling** | Custom CSS with weather-based themes & dark mode |

---

## 🏗️ How It Works

1. **Google Maps Integration**  
   - Users can click anywhere on the interactive map to select a location.  
   - The app fetches its latitude and longitude to request weather data.  

2. **Weather Data Fetching**  
   - Uses **OpenWeather API** to get current conditions and 5-day forecasts.  
   - Updates the UI dynamically whenever a user clicks or searches a new location.  

3. **Data Visualization**  
   - **Chart.js** displays weekly temperature trends in a simple, responsive graph.  

---

## ⚙️ Installation and Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/Kesireddy-rohini/global-weather-app.git
   cd global-weather-app
2. **Install dependencies**
   ```bash
   npm install
3. **Add your API keys**
    ```bash
    REACT_APP_OPENWEATHER_KEY=your_openweather_api_key
    REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
4. **Run the app**
    ```bash
     npm start
8. **Open in browser**
    ```bash
   http://localhost:3000


