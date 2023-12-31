/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json';

/* This creates a page to check visitors before being admitted to an appointment */

function App() {
  const [appointmentData, setAppointmentData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [conditionData, setConditionData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storedAPIkey, setAPIKey] = useState('');

  async function fetchData() {
    const url = window.location.pathname;
    const appointmentId = url.split('/')[2];

    try {
      // Get appointment data
      const responseAppointments = await axios.get(`${config.API_URL}/appointment/${appointmentId}`);
      setAppointmentData(responseAppointments.data.data);

      const locationresponse = await axios.get(`${config.API_URL}/location/${responseAppointments.data.data.location}`);
      setLocationData(locationresponse.data.data);

      const conditionResponse = await axios.get(`${config.API_URL}/conditions/`);
      setConditionData(conditionResponse.data.data);

      const visitorResponse = await axios.get(`${config.API_URL}/visitors/`);
      setVisitorData(visitorResponse.data.data);

      responseAppointments.data.data.visitors.forEach((visitor) => {
        visitor.conditions.forEach((cond) => {
          if (cond.conditionMet === true) {
            selectedConditions.push(cond._id);
          }
        });
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false); // Set loading to false after fetching data
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const appointment = {
      _id: appointmentData._id,
      date: appointmentData.date,
      location: appointmentData.location,
      visitors: appointmentData.visitors,
    };

    appointment.visitors.forEach((vis) => {
      vis.conditions.forEach((cond) => {
        if (selectedConditions.includes(cond._id)) {
          // eslint-disable-next-line no-param-reassign
          cond.conditionMet = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          cond.conditionMet = false;
        }
      });
    });

    await axios.put(`${config.API_URL}/appointment/${appointment._id}`, appointment, { headers: { apikey: storedAPIkey } });
    window.location.href = '/appointments';
  }

  useEffect(() => {
    const grabAPI = sessionStorage.getItem('apikey');
    if (grabAPI) {
      setAPIKey(grabAPI);
    }
    fetchData();
  }, []);

  function getConditionName(id) {
    const cond = conditionData.find((cond) => cond._id === id);

    return cond ? cond.name : '';
  }

  function getConditionDescription(id) {
    const cond = conditionData.find((cond) => cond._id === id);
    return cond ? cond.description : '';
  }

  function getVisitorName(id) {
    const vis = visitorData.find((vis) => vis._id === id);
    return vis ? vis.name : '';
  }

  function getVisitorEmail(id) {
    const vis = visitorData.find((vis) => vis._id === id);
    return vis ? vis.email : '';
  }

  return (
    <div className="page">
      <h1>Virus Validation</h1>
      <h3>
        {locationData.name}
        {' '}
        |
        {' '}
        {new Date(appointmentData.date).toLocaleDateString('en-US')}
      </h3>
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
      <form onSubmit={handleSubmit}>
        {!loading && !error && appointmentData && (
          <>
            <br />
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {appointmentData.visitors.map((visitor) => (
                  <>
                    <tr key={visitor._id}>
                      <td>{getVisitorName(visitor.visitor)}</td>
                      <td>{getVisitorEmail(visitor.visitor)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <div id="conditiontable">
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Are they healthy?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {visitor.conditions.map((condition) => (
                                <tr key={condition._id}>
                                  <td>{getConditionName(condition.condition)}</td>
                                  <td>{getConditionDescription(condition.condition)}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      defaultChecked={condition.conditionMet}
                                      onChange={(event) => {
                                        if (event.target.checked) {
                                          setSelectedConditions(
                                            [...selectedConditions, condition._id],
                                          );
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
                        </div>
                      </td>
                    </tr>

                  </>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button type="submit" onSubmit={handleSubmit} disabled={!storedAPIkey}>Submit</button>
      </form>
    </div>
  );
}
export default App;
