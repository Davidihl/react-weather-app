import './App.css';
import { useState } from 'react';
import apiKey from './apiKey';

export default function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const key = apiKey();

  // Click handle, fetching the location with input value
  const handleClick = async () => {
    try {
      const data = await (
        await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${key}`,
        )
      ).json();
      setWeather(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="App">
      <div>
        <label>
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.currentTarget.value)}
          />
        </label>
        <button onClick={() => handleClick()}>Search</button>
      </div>
      <div>{weather ? weather.name : ''}</div>
    </div>
  );
}
