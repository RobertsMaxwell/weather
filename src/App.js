import './App.css';
import Header from "./components/Header"
import Weather from "./components/Weather"
import Footer from "./components/Footer"
import { useEffect, useState } from 'react';

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [location, setLocation] = useState({lat: "47.60", lon: "-122.33", name: "Seattle, Washington, US"})

  const [fer, setFer] = useState(false)

  useEffect(() => {
    if(location !== null)
    {
      setWeatherData(null)
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`)
      .then(response => response.json())
      .then(data => {
        const hours = new Date().getHours();
        let wd = {
          daily_temp_max: data.daily.temperature_2m_max.slice(1, 5),
          daily_temp_min: data.daily.temperature_2m_min.slice(1, 5),
          daily_code: data.daily.weathercode.slice(1, 5),

          hourly_temp: data.hourly.temperature_2m.slice(hours, hours + 6),
          hourly_code: data.hourly.weathercode.slice(hours, hours + 6),
          wind: Math.round(data.hourly.windspeed_10m[hours]),
          humidity: data.hourly.relativehumidity_2m[hours],

          name: location.name
        }

        setWeatherData(wd)
      })
    }
  }, [location])

  return (
    <div className="App">
      <Header setLocation={setLocation} fer={fer} setFer={setFer} />
      <Weather data={weatherData} fer={fer} />
      <Footer />
    </div>
  );
}

export default App;
