import React from "react";
import {Link} from 'react-router-dom'
import './Groups.css'

class Groups extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sidestyle: "-20%"
        }
        this.sidebar = this.sidebar.bind(this)
        this.create = this.create.bind(this)
        this.close = this.close.bind(this)
    }

    componentDidMount(){
        window.addEventListener("mousemove", this.sidebar)
    }

    componentWillUnmount(){
        window.removeEventListener("mousemove", this.sidebar)
    }

    sidebar(event){
        // event.preventDefault()
        const mouse = event.clientX;
        if(mouse <= 100)
        this.setState({sidestyle: "0%"})
        if(mouse >= 300)
        this.setState({sidestyle: "-20%"})
    }

    create(event){
        event.preventDefault()
        const div1 = document.getElementById("divg1")
        const div2 = document.getElementById("divg2")
        const div3 = document.getElementById("divg3")
        if(div3.style.display === ''){
            div1.style.pointerEvents = 'none'
            div2.style.pointerEvents = 'none'
            div3.style.display = 'block'
        }
    }

    close(event){
        event.preventDefault()
        const div1 = document.getElementById("divg1")
        const div2 = document.getElementById("divg2")
        const div3 = document.getElementById("divg3")
        if(div3.style.display === 'block'){
            div1.style.pointerEvents = 'auto'
            div2.style.pointerEvents = 'auto'
            div3.style.display = ''
        }
    }
    render(){
        return<div>
            <div id="divg1">
                <button id="buttong1" onClick={this.create}>Create a new group</button>
                <span id="spang1"> Your Existings Groups</span>
            </div>
            <div id="divg2">
                
            </div>
            <div id="divg3">
                <button id="buttong2" onClick={this.close}>&#x274C;</button>
                <input id="inputg1" placeholder="Group name"/>
                <textarea id="textareag1" placeholder="Group Description"></textarea>
                <button id="buttong3">Create</button>
            </div>
            <div id="sidebar" style={{left: this.state.sidestyle}}>
                <ul className="ul">
                <li className="texth1">ProfileID: FN0001</li><br></br>
                    <li><Link to='/home'><button className="buttonh2">Home</button></Link></li>
                    <li><Link to='/groups'><button className="buttonh2">Groups</button></Link></li>
                    <li><Link to='/account'><button className="buttonh2">My Account</button></Link></li>
                    <li><button className="buttonh2">Change Profile</button></li>
                    <li><button className="buttonh2">Documents</button></li>
                    <li><button className="buttonh2">Images and Videos</button></li>
                    <li><button className="buttonh2">Audio</button></li>
                    <li><button className="buttonh2">Logout</button></li>
                </ul>
            </div>
        </div>
    }
}

export default Groups