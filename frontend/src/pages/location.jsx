import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../assets/virusLogo.svg';
import initData from '../initdata/locations.json';

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
    fetchData('http://localhost:3000/api/locations');
  }, []);
  
  async function deleteEntry(id){
	  var r= confirm("are you sure you want to delete the location?")
	  if(r == true){
		const response = await axios.delete('http://localhost:3000/api/location/'+id)
		window.location.reload(false)
	  }
  }
  
  async function handleSubmit(event){
	  event.preventDefault()
	  const location = {name:event.target.locname.value,address:event.target.locaddress.value}
	  const response = await axios.post('http://localhost:3000/api/location',location);
	  window.location.reload(false)
  }
  
  return (
    <div className="app-container">
	<h2>Locations</h2>
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
                <th>Name</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((location) => (
                <tr key={location._id}>
                  <td>{location.name}</td>
                  <td>{location.address}</td>
                  <td>
                    <button type="delete" onClick={() => deleteEntry(location._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <h2>Add a Location</h2>
      <div className="vvcontainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="locname"
            required="required"
            placeholder="Location Name"
          />
          <input
            type="text"
            name="locaddress"
            required="required"
            placeholder="Location Address"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default App;