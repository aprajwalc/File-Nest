import './Player.css'
import React from 'react'
import {Link} from 'react-router-dom';
// import ReactPlayer from 'react-player';

class Player extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            sidestyle: "-20%"
        }
        this.sidebar = this.sidebar.bind(this)
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
    render(){
        return<div>
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
            <video controls id='player'>
                {/* <source src={require("E:/Doraemon movies/Doraemon undubbed movies/Dora_Bash_Doraemon_The_Movie_Nobita's_Sky_Utopia_1080p_Eng_Sub_1.mp4")} type="video/mp4" /> */}
      </video>
      </div>
    }
}

export default Player