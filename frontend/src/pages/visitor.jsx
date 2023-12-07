/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/button-has-type */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import initData from '../initdata/visitors.json';
import config from '../config.json';

/* This creates a page to input and manage Visitor information */

function App() {
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedAPIkey, setAPIKey] = useState('');

  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(initData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const grabAPI = sessionStorage.getItem('apikey');
    if (grabAPI) {
      setAPIKey(grabAPI);
    }
    fetchData(`${config.API_URL}/visitors`);
  }, []);

  async function deleteEntry(id) {
    const r = confirm('are you sure you want to delete the visitor?');
    if (r === true) {
      await axios.delete(`${config.API_URL}/visitor/${id}`, { headers: { apikey: storedAPIkey } });
      window.location.reload(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const visitor = { name: event.target.name.value, email: event.target.email.value };
    await axios.post(`${config.API_URL}/visitor`, visitor, { headers: { apikey: storedAPIkey } });
    window.location.reload(false);
  }

  return (
    <div className="app-container">

      <h2 className="visitorheader">Visitors</h2>
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
      {storedAPIkey !== '' && (
        <div>
          <h2>Register New Visitor</h2>
          <div className="vvcontainer">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                required="required"
                placeholder="Visitor Name"
              />
              <input
                type="email"
                name="email"
                required="required"
                placeholder="Visitor email"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div>
        {data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.email}</td>
                  <td>
                    <button type="delete" onClick={() => deleteEntry(visitor._id)} disabled={!storedAPIkey}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
      </div>
    </div>
  );
}

export default App;
