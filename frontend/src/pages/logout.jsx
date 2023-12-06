
import React, { useEffect } from 'react';

{/*This creates a page that simply runs a function that deletes cookies and then immediatly redirects back to the homepage*/ }

function App() {
  useEffect(() => {
    const logout = async () => {

      // Remove items from sessionStorage
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("apikey");

      // Simulate an asynchronous operation (replace with actual async logic if needed)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to the homepage
      window.location.href = "/appointments";
    };

    logout();
  }, []);

  return (
    <div className="App">
      <h1>Logout page</h1>
    </div>
  );
}

export default App;