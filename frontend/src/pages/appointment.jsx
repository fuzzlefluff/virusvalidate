import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import DateTimePicker from 'react-datetime-picker'
import appLogo from '../assets/virusLogo.svg'
import initLocData from '../initdata/locations.json'
import initVisData from '../initdata/visitors.json'
import initCondData from '../initdata/conditions.json'

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
	
	
	async function fetchData() {
    try {
      const response = await axios.get('http://localhost:3000/api/locations');
      setlocationData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(initData);
    } finally {
      setLoading(false);
    }
	try {
      const response = await axios.get('http://localhost:3000/api/conditions');
      setconditionData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(initData);
    } finally {
      setLoading(false);
    }
	try {
      const response = await axios.get('http://localhost:3000/api/visitors');
      setvisitorData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(initData);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSubmit(event) {
	event.preventDefault()
	console.log("submit function running")
	const appointment = {
		date: value,
		location: selectedLocation,
		conditions: selectedConditions,
		visitors: selectedVisitors
	}
	const response = await axios.post('http://localhost:3000/api/appointment', appointment);
	window.location.href = "/appointments";
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="page">
		<h1>Create Appointment</h1>
		<div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: - {error}
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
                    <input type="checkbox" onChange={(event) => {
						if (event.target.checked) {
							setSelectedConditions([...selectedConditions, condition._id])
						} else {
							setSelectedConditions(selectedConditions.filter((id) => id !== condition._id))
						}
					}}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
		<button type="link"><a href={`/conditions`}>Add Condition</a></button>
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
                    <input type="checkbox" onChange={(event) => {
						if (event.target.checked) {
							setSelectedVisitors([...selectedVisitors, visitor._id])
						} else {
							setSelectedVisitors(selectedVisitors.filter((id) => id !== visitor._id))
						}
					}}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
		<button type="link"><a href={`/visitor`}>Add Visitor</a></button>
	  </div>
		
		
		
		<div className="container">
			<div id="dropdown">
				<label>Select Appointment Location</label>
				<br />
				<select defaultValue="" onChange={(event) => setSelectedLocation(event.target.value)}>
					<option disabled value=""> -- Select Location --</option>
					{Array.isArray(locationData) && locationData.map((data)=> (
						<option key={data._id} value={data._id}>
						{data.name}
						</option>
					))}
				</select>
				<br />
				<button type="link">
					<a href="/location">Add Location</a>
				</button>
			</div>
			<br />
			<div className="datetime">
				<label>Select Appointment Time</label>
				<br/>
				<DateTimePicker onChange={onChange} value={value}/>
			</div>
		</div>
		<form onSubmit={handleSubmit}>
		<button type="submit" disabled={!value || !selectedLocation.length || !selectedConditions.length || !selectedVisitors.length} >Create Appointment</button>
		</form>

    </div>
  )
}

export default App
