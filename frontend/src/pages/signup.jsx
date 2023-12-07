/* eslint-disable no-alert */
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config.json';

/* This creates a page to input and manage appointment information */

function App() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const username = event.target.elements.username.value;
    const email = event.target.elements.email.value.toString();
    const password = event.target.elements.password.value.toString();
    const account = { username, email, password };

    try {
      await axios.post(`${config.API_URL}account`, account);
    } catch (err) {
      setError(err.message);
      return;
    }
    window.location.href = '/login';
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
      <div className="logincontainer">
        <form className="loginform form--hidden" id="createAccount" onSubmit={handleSubmit}>
          <h1 className="loginform_heading">Create Account</h1>
          <div className="logininput">
            <input
              type="text"
              id="signupUsername"
              className="loginform__input"
              placeholder="Username"
              required="required"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="email"
              className="loginform__input"
              placeholder="Email Address"
              required="required"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="password"
              className="loginform__input"
              placeholder="Password"
              required="required"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <input
              type="password"
              className="loginform__input"
              placeholder="Confirm password"
              required="required"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <button className="loginform__button" type="submit">
            Sign up
          </button>
          <p className="loginform__text">
            <a className="loginform__link" href="./login" id="linkLogin">
              Already have an account? Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
