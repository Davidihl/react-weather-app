import './App.css';
import { useState } from 'react';
import apiKey from './apiKey';

export default function App() {
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocation] = useState('');
  const [recentLocation, setRecentLocation] = useState([]);
  const key = apiKey();
  const [savedItems, setSavedItems] = useState(false);

  // Click handle, fetching the location with input value
  const handleClick = async () => {
    try {
      const locationData = await (
        await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&APPID=${key}`,
        )
      ).json();
      setLocation(locationData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const saveLocation = () => {
    setSavedItems(true);
    setRecentLocation([location, ...recentLocation]);
    console.log(recentLocation);
  };

  return (
    <div className="App">
      <div>
        <label>
          Location
          <input
            value={locationInput}
            onChange={(event) => setLocationInput(event.currentTarget.value)}
          />
        </label>
        <button onClick={() => handleClick()}>Search</button>
      </div>
      <div>
        <section id="current">
          {location ? (
            <>
              <h1>{location.name}</h1>
              <div>
                <p>Latitude: {location.coord.lat}</p>
                <p>Longitude: {location.coord.lon}</p>
              </div>
              <div id="temperature">
                <p>Current temperature: {location.main.temp}</p>
                <p>Feels like: {location.main.feels_like}</p>
              </div>
              <div id="icon">
                <div>
                  <img
                    alt={location.weather[0].description}
                    src={`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}
                  />
                </div>
                <div>{location.weather[0].description}</div>
              </div>
              <div id="wind">
                <div>Wind speed: {location.wind.speed}</div>
              </div>
              <button onClick={() => saveLocation()}>Save location</button>
            </>
          ) : (
            ''
          )}
        </section>
        {savedItems ? (
          <section id="recent">
            <h1>See also</h1>
            {recentLocation.map((element) => (
              <div key={`recent-${element.name}`}>
                <div>{element.name}</div>
                <div>{element.main.temp}</div>
                <div>
                  <img
                    alt={element.weather[0].description}
                    src={`https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`}
                  />
                </div>
              </div>
            ))}
          </section>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
