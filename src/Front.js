import './Front.css';
import React from 'react'
import { Link } from 'react-router-dom';

function Front() {
	return (
		<div>
			<Head />
			<div id="name">FileNest</div>
			<img id="logo" src={require('C:/Users/apraj/Downloads/DBMS Project/src/logo.png')} alt='logo'></img>
			<Slogan />
		</div>
	);
}

class Head extends React.Component {
	render() {
		return <div id='top'>
			<Link to='/login'>
				<button id="login" className='button'>Login</button>
			</Link>
		</div>
	}
}

class Slogan extends React.Component {
	render() {
		return <div id="slogan">Create <br></br> Add
			<Link to='signup'>
				<button id="start" className="button">Get started</button>
			</Link>
		</div>
	}
}

export default Front;