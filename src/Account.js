import React from 'react'
import {Link} from 'react-router-dom'
import './Account.css'

class Account extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userid: null,
            username: null,
            password: null,
            status: null,
            date: null,
            profiles: null
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/accountserver',{
            method: 'POST',
            headers:{
                "Content-type":"application/json",
                Accept:'application/json',
            },
            body: JSON.stringify({userid: window.localStorage.username})
        })
        .then((res)=>res.json())
        .then((info)=>{
            if(info.status === 'ok'){
                this.setState({userid: info.userid})
                this.setState({username: info.username})
                this.setState({password: info.password})
                this.setState({status: info.premium_status})
                this.setState({date: info.date})
                this.setState({profiles: info.profiles})
                // console.log(info)
            }
            else if(info.status === 'error')
            alert("Error occured. Please try again") 
        })
    }

    render(){
        if(this.state.userid === null)
        return<div>Loading</div>
        console.log(this.state)
        return<div>
            <span id='spana1'>My Account</span>
            <div id='diva1'>
            <div id='diva2'>
                
            </div>
            <div id='diva3'>
            <img id="imga1" src={require('C:/Users/apraj/Downloads/DBMS Project/src/user.png')} alt='logo'></img>
                <input className="inputa1" id='inputai1' defaultValue = {"UserID:  FN"+this.state.userid} disabled/>
                <input className="inputa1" id='inputai2' defaultValue = {"Name:  "+this.state.username} disabled/>
                <input className="inputa1" id='inputai3' type='password' defaultValue = {"Password: "+this.state.password} disabled/>
                <button id='buttona1'>&#x1F58A;</button>            
                <input className='inputa2' id='inputai4' defaultValue = {"Premium status: "+this.state.status} disabled/>
                <input className='inputa2' id='inputai5' defaultValue = {"Number of profiles: "+this.state.profiles} disabled/>
            </div>
            </div>
            <div id="sideoptions">
                <ul className="ul">
                    <li><Link to='/home'><button className="buttonfi2" id='buttonfid1'><img className="imgside" src={require('./home.png')}/></button></Link></li>
                    <li><Link to='/groups'><button className="buttonfi2"><img className="imgside" src={require('./user-group.png')}/></button></Link></li>
                    <li><Link to='/account'><button className="buttonfi2"><img className="imgside" src={require('./user.png')}/></button></Link></li>
                    <li><button className="buttonfi2"><img className="imgside" src={require('./exchange.png')}/></button></li>
                    <li><Link to='/document'><button className="buttonfi2"><img className="imgside" src={require('./google-docs.png')}/></button></Link></li>
                    <li><Link to='/imagesvideos'><button className="buttonfi2"><img className="imgside" src={require('./gallery.png')}/></button></Link></li>
                    <li><Link to='/audio'><button className="buttonfi2"><img className="imgside" src={require('./music-file.png')}/></button></Link></li>
                    <li><Link to='/logout'><button className="buttonfi2"><img className="imgside" src={require('./logout.png')}/></button></Link></li>
                </ul>
				<div className='tooltip'>details
				</div>
            </div>
            </div>
    }
}

export default Account