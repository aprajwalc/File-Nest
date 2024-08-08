import './Login.css';
import React from 'react'
import {Link} from 'react-router-dom';

function Login() {
	return (
		<div id='body1'>
			Login
			<Table/>
		</div>
	);
}

class Table extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			username:"",
			password:""
		};
		this.check = this.check.bind(this);
	}
		check(event){
			event.preventDefault();
			const {username, password} = this.state
			// console.log(username,password)
			let value = -1
			if(username.includes('admin'))
			value = 1
			else
			value = 0
			fetch('http://localhost:5000/loginserver',{
				method:"POST",
				crossDomain:true,
				headers:{
					"Content-type":"application/json",
					Accept:'application/json',
					"Access-Control-Allow-Origin":"*"
				},
				body: JSON.stringify({
					username, password, value
				}),
			})
			.then((res) => res.json())
			.then((info) => {
				console.log(info.status)
				if(info.status === 'ok'){
					alert('Login is succesfull')
					if(value === 0){
						window.localStorage.setItem("username", username)
						window.localStorage.setItem('name', info.name)
						window.localStorage.setItem("files", info.files)
						window.localStorage.setItem("fids", info.id)
						window.location.assign('./home')
					}
					else{
						window.location.assign('./admin')
					}
				}
				else if(info.status === 'dberror'){
					alert('Username or Password is wrong. Please check and try again')
				}
				else if(info.status === 'error'){
					alert('Error occurred')
				}
			})
	}
	render(){
		return<form id="form" onSubmit={this.check}>
			<input id='input1' placeholder='Email id' required onChange={(e) => this.setState({ username: e.target.value })} /> {/*pattern='[a-z]{1,}[0-9]{0,}@gmail.com'/>*/}
			<input id='input2' type='password' placeholder='Password' required onChange={(e) => this.setState({ password: e.target.value })}/>
			<button id='button'>Login</button>
			{/* <Link to='/verifyuser'>*/}
            <span id='spanl1'>Forgot password?</span>
			{/* </Link> */}
			<Link to='/signup'>
			<span id='spanl2'>Not a User! Sign up!</span>
            </Link>
			</form>
	}
}

export default Login;