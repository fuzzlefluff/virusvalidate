{/*<!-- Camren Landry -->*/}
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../assets/virusLogo.svg';
import initData from '../initdata/conditions.json';
import config from '../config.json'

const App = () => {
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchData(config.API_URL + '/conditions');
  }, []);


  async function deleteEntry(id){
	  var r= confirm("are you sure you want to delete the condition?")
	  if(r == true){
		const response = await axios.delete(config.API_URL + '/condition/'+id)
		window.location.reload(false)
	  }
  }
  
  async function handleSubmit(event){
	  event.preventDefault()
	  const condition = {
		  name:event.target.name.value,
		  description:event.target.description.value
		}
	  const response = await axios.post(config.API_URL + '/condition',condition);
	  window.location.reload(false)
  }
  
  return (
    <div className="app-container">
	<h2>Conditions</h2>
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: - {error}
          </div>
        )}
      </div>
      <div>
        {data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Description</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
				{data.map((condition) => (
					<tr key={condition._id}>
						<td key={`${condition._id}-name`}>{condition.name}</td>
						<td key={`${condition._id}-description`}>{condition.description}</td>
						<td key={`${condition._id}-delete`}> <button type="delete" onClick={() => deleteEntry(condition._id)}>Delete</button> </td>
					</tr>
				))}
			</tbody>
          </table>
        )}
      </div>
      <h2>Create New Condition</h2>
      <div className="vvcontainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            required="required"
            placeholder="Condition Name"
          />
          <input
            type="text"
            name="description"
            required="required"
            placeholder="Condition Description"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default App;