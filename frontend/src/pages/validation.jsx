import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import appLogo from '../assets/virusLogo.svg'
import initCondition from '../initdata/conditions.json'
import initVisitor from '../initdata/visitors.json'
import config from '../config.json'

{/*This creates a page to check visitors before being admitted to an appointment*/ }

function App() {

  const [appointmentData, setAppointmentData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [conditionData, setConditionData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchData() {
    const url = window.location.pathname;
    const appointmentId = url.split('/')[2];

    try {
      // Get appointment data
      const responseAppointments = await axios.get(config.API_URL + '/appointment/' + appointmentId);
      setAppointmentData(responseAppointments.data.data);

      const locationresponse = await axios.get(config.API_URL + '/location/' + responseAppointments.data.data.location);
      setLocationData(locationresponse.data.data);

      const conditionResponse = await axios.get(config.API_URL + '/conditions/');
      setConditionData(conditionResponse.data.data);

      const visitorResponse = await axios.get(config.API_URL + '/visitors/');
      setVisitorData(visitorResponse.data.data);


      console.log(responseAppointments.data.data);
      console.log(visitorResponse.data.data);

      setError(null);
    }
    catch (err) {
      setError(err.message);
    }
    setLoading(false); // Set loading to false after fetching data
  }

  useEffect(() => {
    fetchData();
  }, []);

  function getConditionName(id) {

    const cond = conditionData.find((cond) => cond._id === id);

    return cond ? cond.name : ''; // Handle the case when no matching condition is found
  }

  function getConditionDescription(id) {
    const cond = conditionData.find((cond) => cond._id === id);
    return cond ? cond.description : ''; // Handle the case when no matching condition is found
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
      <h3>{locationData.name} | {new Date(appointmentData.date).toLocaleDateString('en-US')}</h3>
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: - {error}
          </div>
        )}
      </div>
      {!loading && !error && appointmentData && (
        <>
          <br></br>
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
                  <tr key={visitor.visitor}>
                    <td>{getVisitorName(visitor.visitor)}</td>
                    <td>{getVisitorEmail(visitor.visitor)}</td>
                  </tr><tr>
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
                                <td><input type="checkbox" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr></>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div>
        <button type="submit">
          <a href={`/appointments`}>Submit</a>
        </button>
      </div>
    </div>
  )
}
export default App
