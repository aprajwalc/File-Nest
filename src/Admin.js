import React from "react";
import {Link} from 'react-router-dom'
import './Admin.css'

class Admin extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            users: null,
            usernames: null,
            premium: null
        }
    }
    componentDidMount(){
        fetch('http://localhost:5000/adminserver',{
            method: 'POST',
            headers:{
                "Content-type":"application/json",
                Accept:'application/json',
            },
            // body: JSON.stringify({userid: window.localStorage.username})
        })
        .then((res)=>res.json())
        .then((info)=>{
            if(info.status === 'ok'){
                this.setState({userid: info.users})
                this.setState({usernames: info.usernames})
                this.setState({premium: info.premium})
                // console.log(info)
            }
            else if(info.status === 'error')
            alert("Error occured. Please try again") 
        })
    }

    render(){
        var {userid, usernames, premium} = this.state
        console.log(userid)
        if(userid){
            return<div>
                <span id="spanadmin">Admins</span>
                <div id="users">
                <div id="usersdiv">
                    <span id="userid">UserID</span>
                    <span id="username">UserName</span>
                    <span id="premium">Premium Status</span>
                </div>
                {userid.map((title, index)=>{
                    return<div id="usersdiv">
                        <span id="userid">{title}</span>
                        <span id="username">{usernames[index]}</span>
                        <span id="premium">{premium[index]}</span>
                        </div>
                })}
            </div>
            </div>
        }
        // return<div>Loading</div>
    }
}

export default Admin