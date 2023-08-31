import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../assets/virusLogo.svg';
import initData from '../initdata/locations.json';

const App = () => {
  const [appointmentData, setappointmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState([]);

  async function fetchData() {
  try {
    // Get appointments data
    const responseAppointments = await axios.get('http://localhost:3000/api/appointments');
    setappointmentData(responseAppointments.data.data);
    setError(null);
  } catch (err) {
    setError(err.message);
    setappointmentData(initData);
  }

  try {
    // Get locations data
    const responseLocations = await axios.get('http://localhost:3000/api/locations');
    setLocationData(responseLocations.data.data);
    setError(null);
  } catch (err) {
    setError(err.message);
    setLocationData(initData);
  }

  setLoading(false); // Set loading to false after fetching data
}

  useEffect(() => {
    fetchData();
  }, []);

  async function deleteEntry(id){
    var r= confirm("Are you sure you want to delete the appointment?");
    if(r === true){
      const response = await axios.delete('http://localhost:3000/api/appointment/'+id);
      window.location.reload(false);
    }
  }
  
  function getLocationName(id) {
  var returnLoc = locationData.find(location => location._id == id);
  if (returnLoc) {
    return returnLoc.name;
  } else {
    return "Invalid ID!";
  }
}
  return (
    <div className="app-container">
      <h2>Appointments</h2>
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: - {error}
          </div>
        )}
      </div>
      <div>
        {appointmentData.length > 0 && locationData.length > 0 && (
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
              {appointmentData.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{new Date(appointment.date).toLocaleDateString('en-US')}</td>
                  <td>{getLocationName(appointment.location)}</td>
                  <td>{appointment.visitors.length}</td>
                  <td>{appointment.conditions.length}</td>
                  <td>
					<button type="link"><a href={`/validation/${appointment._id}`}>Validate</a></button>
                  </td>
                  <td>
                    <button type="delete" onClick={() => deleteEntry(appointment._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
	  <button type="link"><a href={`/appointment`}>Create New Appointment</a></button>
    </div>
  );
};

export default App;