import React from "react";

function User(props){

    return(
        
        <div> 
            <h3>{props.id}</h3>
            <h3>{props.name}</h3>
            <p>{props.birthdate}</p>
            <h4>{props.mail}</h4>

        </div>
    );
}

export default User;