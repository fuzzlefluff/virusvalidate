/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

/* This creates a page to allow guests to upload information
about conditions for appointments they are invited too */

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conditionData, setConditionData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);

  async function fetchData() {
    const url = window.location.pathname;

    const appointmentId = url.split('/')[2];
    const visitorId = url.split('/')[3];

    try {
      // get appointment data
      const responseAppointments = await axios.get(`${config.API_URL}/appointment/${appointmentId}`);

      // get visitor data
      const responseVisitors = await axios.get(`${config.API_URL}/visitor/${visitorId}`);
      setVisitorData(responseVisitors.data.data);

      const conditionsArray = [];
      for (let i = 0; i < responseAppointments.data.data.conditions.length; i += 1) {
        const conditionresponse = axios.get(`${config.API_URL}/condition/${responseAppointments.data.data.conditions[i]}`);
        conditionsArray.push(conditionresponse.data.data);
      }
      setConditionData(conditionsArray);
    } catch (err) {
      setError(err.message);
      setVisitorData([]);
      setConditionData([]);
    }

    setLoading(false); // Set loading to false after fetching data
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="page">
      <h1>Guest Page</h1>
      <h3>
        {visitorData.name}
        {' '}
      </h3>
      <br />
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
      <div id="visitortable">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Select Documentation</th>
              <th>Upload</th>
            </tr>
          </thead>
          <tbody>
            {conditionData.map((condition) => (
              <tr key={condition._id}>
                <td>{condition.name}</td>
                <td><input type="file" /></td>
                <td>
                  <button type="submit"><a href="/appointment">Submit</a></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
