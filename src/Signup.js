import React from 'react';
import './Signup.css';
// import { Link } from 'react-router-dom';

function Signup(){
    return(
        <div id='body2'>
            <img id="logos1" src={require('C:/Users/apraj/Downloads/DBMS Project/src/logo.png')} alt='logo'></img>
            <Rectangle/>
        </div>
    );
}

class Rectangle extends React.Component{
    constructor(props){
		super(props)
		this.state = {
			name :"",
			username :"",
            password :"",
            confirm_password :""
		};
		this.signup = this.signup.bind(this);
	}
    signup(event){
        event.preventDefault();
        const {name, username, password, confirm_password} = this.state
        if(password!==confirm_password)
        alert('Password and Confirm password must be same')
        if(username.includes('admin'))
        alert("Don't include admin in username")
        else{
            if(password === confirm_password){
                let value = 0
                fetch('http://localhost:5000/signupserver',{
                    method:"POST",
                    crossDomain:true,
                    headers:{
                        "Content-type":"application/json",
                        Accept:'application/json',
                        "Access-Control-Allow-Origin":"*"
                    },
                    body: JSON.stringify({
                        name, username, password, value
                    }),
                })
                .then((res) => res.json())
                .then((info) => {
                    console.log(info.status)
                    if(info.status === 'ok'){
                        alert('User is created')
                        window.location.assign('./security')
                    }
                    else if(info.status === 'found'){
                        alert('Username(email) exists!')
                    }
                    else if(info.status === 'error'){
                        alert("Sorry, we couldn't create the user")
                    }
                })
            }
        }
    }
    render(){
        return<div id='blue'>
            <span id='spans1'>Sign up</span>
            <form id='table1' onSubmit={this.signup}>
            <input className='input1' placeholder='Name' required onChange={(e) => this.setState({ name: e.target.value })}/>
            <input className='input1' placeholder='Username' required onChange={(e) => this.setState({ username: e.target.value })}/>
            <input type='password' className='input1' placeholder='Password' required onChange={(e) => this.setState({ password: e.target.value })}/>
            <input type='password' className='input1' placeholder='Confirm Password' required onChange={(e) => this.setState({ confirm_password: e.target.value })}/>
            <button id='button1'>Save and Sign up</button>
            </form>
        </div>
    }
}

export default Signup;