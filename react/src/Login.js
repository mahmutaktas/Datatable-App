import React, { useState, useEffect, useRef } from 'react';

 
function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  const isFirstRun = useRef(true);
 
  // handle button click of login form
  const handleLogin = () => {
    console.log("here")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ username: username.value, password: password.value })
  };


  //post login info to api
  fetch('http://127.0.0.1:5000/', requestOptions)
      .then((response) => response.json())
      .then(data => {
        setLoading(true)});    

  }


  //if server verifies the username and password, direct to dashboard
  useEffect (() => {

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    
      //get server response
     (async () => {
      const response = await fetch ('http://127.0.0.1:5000/loggedIn/'
      );
  
      const res = await response.json();
      console.log("what " + res.response + "token: " + res.token)

      console.log("login resp: " + res)
      if(res.response === true){
        console.log("TRUE => ROUTE TO DASH")
        
        //store login info to save login status after refresh
        localStorage.setItem('loggedIn', res.response)
        localStorage.setItem('token', res.token)

        console.log(">>>LOCAl: " + typeof(localStorage.getItem('loggedIn') == 'true'))

        props.history.push({
          pathname: "/dashboard/", 
          auth: res.response,
          token: res.token
        });

      }else{
        console.log("FALSE => ROUTE TO LOGIN")
        props.history.push("/");
        setLoading(false);
      }

    })();


  }, [loading]);
 
  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />

    </div>

  );
}
 
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
 
export default Login;