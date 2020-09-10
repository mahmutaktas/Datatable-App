import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './ModalStyle.css'



 
function Dashboard (props) {

  const location = useLocation();

  
  const auth_bool = (localStorage.getItem('loggedIn') == 'true')
  const [auth, setAuth] = useState(auth_bool);

  const [dataAdded, setDataAdded] = useState(false);
  const [userInfo, setUserInfo] = useState([])

  const [token, setToken] = useState(localStorage.getItem('token'))

  const form_id = useFormInput('');
  const form_name = useFormInput('');
  const form_birthdate = useFormInput('');
  const form_mail = useFormInput('');

  function refreshPage() {
    window.location.reload(false);
  }



  console.log("DASH =>> auth is " + location.auth)

  
  console.log("TOKEN IS >>>>>>>>> " + token)

  
  //if server can't verifies the username and password 
  //or user doesn't have the token then redirect to login
  useEffect (()=>  {

    if(auth  !== true || !token){
      props.history.push("/")
    }


  }, [auth]);

  const fetchData = async () => {

    //get the datatable values from the server
     const requestOptions = {
      method : 'GET',
      headers: { 'Content-Type': 'application/json', 'access-token': token }
  };
    const response = await fetch ('http://127.0.0.1:5000/datatable/', requestOptions);

    const res = await response.json();


    setUserInfo(res)
    console.log(userInfo)
    console.log(">>>>>>>>>>>>>>") 
    
  }

  useEffect (() => {

    fetchData()
    setDataAdded(false)

  },[]);


  const handleLogout = () => {
    setAuth(false)
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('token', null)
    setToken(null)
  }

  //post the new user info to the server
  const handleDataPost = () => {

    console.log("here")
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "access-token":  token},
      body: JSON.stringify({ id: form_id.value, name: form_name.value, birthdate: form_birthdate.value, mail: form_mail.value })
  };
  fetch('http://127.0.0.1:5000/datatable/', requestOptions)
      .then((response) => response.json());
   
  }

 
  return (
    
    <div>
  <Popup
    trigger={<button className="button"> ADD NEW DATA </button>}
    modal
    nested
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> NEW DATA </div>
        <div className="content">
          {' '}
            <div>
          ID<br />
          <input type="number" {...form_id} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }}>
          NAME<br />
          <input type="text" {...form_name} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }}>
          BIRTHDATE<br />
          <input type="text" {...form_birthdate} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }}>
          E-MAIL<br />
          <input type="text" {...form_mail} autoComplete="new-password" />
        </div>
        <input type="button" onClick={() => { handleDataPost();  refreshPage();} } value="ADD NEW DATA" /><br />


        </div>
        <div className="actions">
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            close modal
          </button>
        </div>
      </div>
    )}
  </Popup>

        <table>
         <tbody>

          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>BIRTHDATE</th>
            <th>MAIL</th>
          </tr>
           {
                userInfo.map(user =>(
                   <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.birthdate}</td>
                      <td>{user.mail}</td>

                   </tr>
                ))
           }
         </tbody>
       </table>
          
        <br /> 
        <br />
        <button onClick={handleLogout} >Logout</button>


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
 
export default Dashboard;