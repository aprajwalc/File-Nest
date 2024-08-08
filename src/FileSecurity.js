import React from "react";
import './FileSecurity.css'

class FileSecurity extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            security: ''
        }
        this.openfile = this.openfile.bind(this);
    }
    componentDidMount(){
        fetch('http://localhost:5000/detailserver',{
            method: 'POST',
            crossDomain:true,
            headers:{
                "Content-type":"application/json",
                Accept:'application/json',
                "Access-Control-Allow-Origin":"*"
            },
            body: JSON.stringify({fileid: window.localStorage.currentfid})
        })
        .then((res)=>res.json())
        .then((info)=>{
            console.log(info.status)
            if(info.status === 'ok'){
                console.log(info.result)
                window.localStorage.setItem("details", JSON.stringify(info.result))
                // window.localStorage.setItem("currentfid", info.result.fid)
                this.setState({security: info.security})
                console.log(info.security.password)
                if(window.localStorage.cval === '1' && info.security.password===null)
                    window.location.assign('./file')
                else if(window.localStorage.cval === '0' && info.security.password===null)
                    window.location.assign('./editor')
                else{
                    var id = document.getElementById("inputfsi1");
                    var name = document.getElementById("inputfsi2");
                    id.value = "FileID: " + window.localStorage.getItem("currentfid")
                    name.value = "FileName: " + window.localStorage.getItem("currentfile");
                }
            }
            else if(info.status === 'error'){
                alert("Error occured")
            }
        })
    }

    openfile(event){
        event.preventDefault();
        var p = document.getElementById("inputfsi3");
        if(p.value === this.state.security.password){
            if(window.localStorage.cval === '1')
                window.location.assign('./file')
            else if(window.localStorage.cval === '0')
                window.location.assign('./editor')
        }
        else{
            alert("Incorrect Password. Please try again")
        }
    }

    render(){
        return<div>
            <div id="divfs1">
                <span id="spanfs1">Your file is password protected</span>
                <input className="inputfs1" id="inputfsi1" disabled defaultValue={"FileID: "}/>
                <input className="inputfs1" id="inputfsi2" disabled defaultValue={"FileName: "}/>
                <input className="inputfs1" id="inputfsi3" placeholder="Enter password" type="password" required/>
                <button id="buttonfs1" onClick={(e)=>this.openfile(e)}>Open the file</button>
            </div>
        </div>
    }
}

export default FileSecurity