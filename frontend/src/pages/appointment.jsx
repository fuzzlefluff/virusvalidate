/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import initLocData from '../initdata/locations.json';
import initVisData from '../initdata/visitors.json';
import initCondData from '../initdata/conditions.json';
import config from '../config.json';

/* This creates a page to input and create appointments */

function App() {
  const [locationData, setlocationData] = useState(initLocData);
  const [conditionData, setconditionData] = useState(initCondData);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [visitorData, setvisitorData] = useState(initVisData);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, onChange] = useState(null);
  const [storedAPIkey, setAPIKey] = useState('');

  async function fetchData() {
    try {
      const response = await axios.get(`${config.API_URL}/locations`);
      setlocationData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    try {
      const response = await axios.get(`${config.API_URL}/conditions`);
      setconditionData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    try {
      const response = await axios.get(`${config.API_URL}/visitors`);
      setvisitorData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const appointment = {
      date: value,
      location: selectedLocation,
      visitorsConditions: selectedVisitors.map((visitorId) => ({
        visitor: visitorId,
        conditions: selectedConditions || [],
      })),
    };
    await axios.post(`${config.API_URL}/appointment`, appointment, { headers: { apikey: storedAPIkey } });
    window.location.href = '/appointments';
  }

  useEffect(() => {
    const grabAPI = sessionStorage.getItem('apikey');
    if (grabAPI) {
      setAPIKey(grabAPI);
    }
    fetchData();
  }, []);

  return (
    <div className="page">
      <h1>Create Appointment</h1>
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: -
            {' '}
            {error}
          </div>
        )}
      </div>

      <div id="conditiontable">
        <h2> Conditions </h2>
        {conditionData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Check For</th>
              </tr>
            </thead>
            <tbody>
              {conditionData.map((condition) => (
                <tr key={condition._id}>
                  <td>{condition.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedConditions([...selectedConditions, condition._id]);
                        } else {
                          setSelectedConditions(
                            selectedConditions.filter((id) => id !== condition._id),
                          );
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button type="link"><a href="/conditions">Add Condition</a></button>
      </div>

      <div id="visitortable">
        <h2> Visitors </h2>
        {visitorData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Invite</th>
              </tr>
            </thead>
            <tbody>
              {visitorData.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.email}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedVisitors([...selectedVisitors, visitor._id]);
                        } else {
                          setSelectedVisitors(selectedVisitors.filter((id) => id !== visitor._id));
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button type="link"><a href="/visitor">Add Visitor</a></button>
      </div>

      <div className="container">
        <div id="dropdown">
          <div>Select Appointment Location</div>
          <br />
          <select defaultValue="" onChange={(event) => setSelectedLocation(event.target.value)}>
            <option disabled value=""> -- Select Location --</option>
            {Array.isArray(locationData) && locationData.map((data) => (
              <option key={data._id} value={data._id}>
                {data.name}
              </option>
            ))}
          </select>
          <br />
          <a href="/location">
            <button type="link">
              Add Location
            </button>
          </a>
        </div>
        <br />
        <div className="datetime">
          <div>Select Appointment Time</div>
          <br />
          <DateTimePicker onChange={onChange} value={value} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={!value || !selectedLocation.length || !selectedConditions.length || !selectedVisitors.length || !storedAPIkey}>Create Appointment</button>
      </form>

    </div>
  );
}

export default App;
