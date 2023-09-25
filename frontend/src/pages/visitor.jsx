import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../assets/virusLogo.svg';
import initData from '../initdata/visitors.json';
import config from '../config.json'

{/*This creates a page to input and manage Visitor information*/}

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
    fetchData(config.API_URL + '/visitors');
  }, []);

 async function deleteEntry(id){
	  var r= confirm("are you sure you want to delete the visitor?")
	  if(r == true){
		const response = await axios.delete(config.API_URL + '/visitor/'+id)
		window.location.reload(false)
	  }
  }
  
  async function handleSubmit(event){
	  event.preventDefault()
	  const visitor = {name:event.target.name.value,email:event.target.email.value}
	  const response = await axios.post(config.API_URL + '/visitor',visitor);
	  window.location.reload(false)
  }
  
  return (
    <div className="app-container">
	
		<h2 className="visitorheader">Visitors</h2>
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
          <button type="submit">Save Visitor Information</button>
        </form>
      </div>
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
                    <button type="delete" onClick={() => deleteEntry(visitor._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
		<br/>
      </div>
    </div>
  );
};

export default App;