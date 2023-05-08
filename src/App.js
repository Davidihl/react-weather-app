import './App.css';
import { useEffect, useState } from 'react';
import apiKey from './apiKey';

export default function App() {
  const key = apiKey();
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocation] = useState('');
  const [recentLocation, setRecentLocation] = useState([]);
  const [savedItems, setSavedItems] = useState(false);
  const [cachedItems, setCachedItems] = useState([]);

  // useEffect hook to load data from local storage
  useEffect(() => {
    const storedArray = localStorage.getItem('cachedItems');
    if (storedArray) {
      setCachedItems(JSON.parse(storedArray));
    }
  }, []);

  // useEffect hook to save data to local storage when cachedItems changes
  useEffect(() => {
    localStorage.setItem('cachedItems', JSON.stringify(cachedItems));
  }, [cachedItems]);

  // Add item to local storage
  function addItem(item) {
    setCachedItems([item, ...cachedItems]);
  }

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

  // Click add, save weather object into an array that gets mapped later on
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
              <button
                onClick={() => {
                  saveLocation();
                  addItem(location);
                }}
              >
                Save location
              </button>
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
            <button>Refresh all</button>
          </section>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
