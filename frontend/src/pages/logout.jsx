import React from 'react'
import { useState } from 'react'
import { useEffect} from 'react'
import axios from 'axios'

function App() {
	 
  useEffect(() => {
    sessionStorage.removeItem("username");
	window.location.href = "/appointments";
  }, []);
  
  return (
	<div className="App">
		<h1>Logout page</h1>
	</div>
  )
}

export default App