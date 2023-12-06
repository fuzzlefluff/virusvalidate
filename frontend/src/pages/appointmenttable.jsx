import React, { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../assets/virusLogo.svg';
import config from '../config.json';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [storedAPIkey, setAPIKey] = useState('')

  async function fetchData() {
    try {
      const responseAppointments = await axios.get(config.API_URL + '/appointments');
      setAppointments(responseAppointments.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAppointments([]);
    }

    try {
      const responseLocations = await axios.get(config.API_URL + '/locations');
      setLocations(responseLocations.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLocations([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    const grabAPI = sessionStorage.getItem('apikey')
    if (grabAPI) {
      setAPIKey(grabAPI)
    }
    fetchData();
  }, []);

  async function deleteAppointment(id) {
    const confirmed = window.confirm('Are you sure you want to delete this appointment?');
    if (confirmed) {
      try {
        await axios.delete(config.API_URL + '/appointment/' + id, { headers: { 'apikey': storedAPIkey } });
        fetchData(); // Refresh the data after deleting
      } catch (err) {
        setError('Error deleting appointment: ' + err.message);
      }
    }
  }

  function getLocationName(id) {
    const location = locations.find((loc) => loc._id === id);
    return location ? location.name : 'Invalid ID';
  }

  return (
    <div className="app-container">
      <h2>Appointments</h2>
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && <div id="error">There is a problem getting data from the API: - {error}</div>}
      </div>
      <div>
        {appointments.length > 0 && locations.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Number of Visitors</th>
                <th>Number of Conditions to be Checked</th>
                <th>Validate</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{new Date(appointment.date).toLocaleDateString('en-US')}</td>
                  <td>{getLocationName(appointment.location)}</td>
                  <td>{appointment.visitors.length}</td>
                  <td>
                    {new Set(
                      appointment.visitors
                        .flatMap((visitor) => visitor.conditions.map((condition) => condition.condition))
                    ).size}
                  </td>

                  <td>
                    <button type="link">
                      <a href={`/validation/${appointment._id}`}>Validate</a>
                    </button>
                  </td>
                  <td>
                    <button type="delete" onClick={() => deleteAppointment(appointment._id)} disabled={!storedAPIkey}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button type="link">
        <a href={`/appointment`}>Create New Appointment</a>
      </button>
    </div>
  );
};

export default Appointments;
