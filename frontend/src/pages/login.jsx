{/*<!-- Chetna Anjana -->*/}
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import config from '../config.json'

{/*This creates a page to allow employees to login*/}

function App() {
	
  const [error, setError] = useState(null);
  
  async function handleSubmit(event){
	  event.preventDefault()
	  var username = event.target.elements.username.value;
	  if(username.includes('@')){
		  var email = username;
	  }
	  const password = event.target.elements.password.value;
	  const account = {username,email,password}
	  let response;
	  try{
	  response = await axios.post(config.API_URL + '/login',account);
	  }
	  catch(err) {
		 setError(err.message);
		 return
	  }
	  sessionStorage.setItem("username",response.data.data)
	  window.location.href = "/appointments";
	  
  }
  
  return (
	<div className="App">
	<div className="apiinfo">
        {error && (
          <div id="error">
            Login has failed
          </div>
        )}
      </div>
		<div className="logincontainer" id="logincontainer">
			<form className="loginform" id="login" onSubmit={handleSubmit}>
				<h1 className="loginform_heading">Login</h1>
				<div className="logininput">
					<input type="text" className="loginform__input" autoFocus placeholder="Username" required="required" name="username"/>
				</div>
				<div className="input">
					<input type="text" className="loginform__input" autoFocus placeholder="Password" required="required" name="password"/>
				</div>
				<button className="loginform__button" type="submit">Login</button>
				<p className="text">
					<a href="#" className="loginform__link">Forgot password?</a>
				</p>
				<p className="form__text">
					<a className="loginform__link" href="./signup" id="linkCreateAccount">Don't have an account? Sign up</a>
				</p>
			</form>
		</div>
	</div>
  )
}
export default App