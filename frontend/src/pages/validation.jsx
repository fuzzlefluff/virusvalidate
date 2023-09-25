import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import appLogo from '../assets/virusLogo.svg'
import initCondition from '../initdata/conditions.json'
import initVisitor from '../initdata/visitors.json'
import config from '../config.json'

{/*This creates a page to check visitors before being admitted to an appointment*/}

function App() {
  const [appointmentData, setAppointmentData] = useState([]);
  const [locationData, setLocationData] =useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


async function fetchData() {
  const url = window.location.pathname;
  const appointmentId = url.split('/')[2];

  try {
    // Get appointment data
    const responseAppointments = await axios.get(config.API_URL + '/appointment/'+appointmentId);
    setAppointmentData(responseAppointments.data.data);
	
	console.log(responseAppointments.data.data);
	
    const locationresponse = await axios.get(config.API_URL + '/location/'+ responseAppointments.data.data.location);
    setLocationData(locationresponse.data.data);
	
	
    const visitorsArray = [];
	const conditionsArray = [];
const uniqueConditions = {}; // Create an object to store unique conditions

for (let i = 0; i < responseAppointments.data.data.visitors.length; i++) {
  const visitorresponse = await axios.get(config.API_URL + '/visitor/' + responseAppointments.data.data.visitors[i].visitor);
  visitorsArray.push(visitorresponse.data.data);

  for (let j = 0; j < responseAppointments.data.data.visitors[i].conditions.length; j++) {
    const conditionresponse = await axios.get(config.API_URL + '/condition/' + responseAppointments.data.data.visitors[i].conditions[j].condition);
    const conditionData = conditionresponse.data.data;

    // Check if the condition name is unique
    if (!uniqueConditions[conditionData.name]) {
      uniqueConditions[conditionData.name] = true; // Mark as seen
      conditionsArray.push(conditionData);
    }
  }
}

	
	console.log(visitorsArray);
	console.log(conditionsArray);
	setVisitorData(visitorsArray);
    setConditionData(conditionsArray);
	
    setError(null);
  } catch (err) {
    setError(err.message);
  }
  
  setLoading(false); // Set loading to false after fetching data
}

  useEffect(() => {
    fetchData();
  }, []);
  
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
		<div id="visitortable">
		<br/>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{visitorData.map((data)=>
					<div>
						<tr key={data._id}>
							<td>{data.name}</td>
							<td>{data.email}</td>
						</tr>
						<tr>
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
										{conditionData.map((data)=>
											<tr>
												<td>{data.name}</td>
												<td>{data.description}</td>
												<td><input type="checkbox"/></td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</tr>
					</div>
					)}
				</tbody>
			</table>
		</div>
		<div><button type="submit"><a href={`/appointments`}>Submit</a></button></div>
    </div>
  )
}

export default App
