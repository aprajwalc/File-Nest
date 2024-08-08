import React from "react";
import {Link} from 'react-router-dom'
import './Home.css'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            value1 : 0,
            value2 : 0,
            sidestyle: "-20%"
        }
        this.sidebar = this.sidebar.bind(this)
        this.handlefile = this.handlefile.bind(this)
        this.create = this.create.bind(this)
        this.close = this.close.bind(this)
        this.delete = this.delete.bind(this)
        this.newfile = this.newfile.bind(this)
        this.sort = this.sort.bind(this)
        this.selectchange = this.selectchange.bind(this)
    }

    componentDidMount(){
        // document.addEventListener("click",this.dropdown)
        window.addEventListener("mousemove", this.sidebar)
    }

    componentWillUnmount(){
        // document.removeEventListener("click", this.dropdown)
        window.removeEventListener("mousemove", this.sidebar)
    }

    sidebar(event){
        // event.preventDefault()
        const mouse = event.clientX;
        if(mouse <= 20)
        this.setState({sidestyle: "0%"})
        if(mouse >= 300)
        this.setState({sidestyle: "-20%"})
    }

    handlefile(event){
        event.preventDefault()
        const selectfile = event.target.files[0]; // Get the first file from the list (if multiple)
        if (selectfile){
            document.getElementById('inputhi1').value = selectfile.name;
            let size = selectfile.size
            const div = document.getElementById('inputhi2')
            if(size < 1024)
            div.value = parseInt(size)+' bytes'
            else{
                size = (size/1024).toFixed(2)
                if(size < 1024)
                div.value = parseFloat(size)+' KB'
                else{
                    size = (size/1024).toFixed(2)
                    if(size < 1024)
                    div.value = parseFloat(size)+' MB'
                }
            }
        }
    }

    upload(event){
        event.preventDefault()
        const file = document.getElementById('inputhi3').files[0];
        const filedata = new FormData()
        filedata.append('file', file)
        const input = document.getElementById("inputhi4")
        var password = '__null__'
        if(input.disabled === false){
            password = input.value
        }
        filedata.append('password', password)
        fetch('http://localhost:5000/uploadserver',{
            method:"POST",
            body: filedata
        })
        .then((res) => res.json())
        .then((info) => {
            console.log(info.status)
            if(info.status === 'ok'){
                alert('File uploaded successfully')
                window.localStorage.setItem('files',info.files)
                window.localStorage.setItem('fids', info.id)
                window.location.assign('./home')
            }
            else if(info.status === 'filerror'){
                alert("Please select the file")
            }
            else if(info.status === 'error'){
                alert("Sorry, we couldn't upload the file")
            }
        })
    }

    create(event, id){
        event.preventDefault()
        const div1 = document.getElementById("divh1")
        const div5 = document.getElementById("divh5")
        const div = document.getElementById(id)
        const divf = document.getElementById("filesh1")
        console.log(id)
        const div6 = document.getElementById("divh6")
        // document.body.style.background = 'rgba(0, 0, 0, 0.5)'
        // div1.style.background = 'rgba(0, 0, 0, 0.5)'
        div5.style.display = 'none'
        divf.style.display = 'none'
        if(div.style.display === ''){
            div1.style.pointerEvents = 'none'
            div5.style.pointerEvents = 'none'
            div.style.display = 'block'
            divf.style.pointerEvents = 'none'
        }
    }

    close(event){
        event.preventDefault()
        const div1 = document.getElementById("divh1")
        const div5 = document.getElementById("divh5")
        const div4 = document.getElementById("divh4")
        const div6 = document.getElementById("divh6")
        const divf = document.getElementById("filesh1")
        document.body.style.backgroundColor = '#cddfff'
        div1.style.backgroundColor = '#142678'
        div5.style.display = 'block'
        divf.style.display = 'block'
        if(div4.style.display === 'block'){
            div1.style.pointerEvents = 'auto'
            div5.style.pointerEvents = 'auto'
            divf.style.pointerEvents = 'auto'
            div4.style.display = ''
        }
        if(div6.style.display === 'block'){
            div1.style.pointerEvents = 'auto'
            div5.style.pointerEvents = 'auto'
            divf.style.pointerEvents = 'auto'
            div6.style.display = ''
        }
    }

    send(event, title, fileid){
        event.preventDefault()
        console.log(title)
        window.localStorage.setItem("currentfid", fileid)
        window.localStorage.setItem("currentfile", title)
        let cval = -1
        if(title.includes('.')){
            window.localStorage.setItem("cval",1)
            cval = 1
            window.location.assign('./filesecurity')
        }
        else{
            window.localStorage.setItem("cval", 0)
            cval = 0
            window.location.assign('./filesecurity')
        }
    }

    delete(event, title){
        event.preventDefault()
        let conf = window.confirm(`Do you want to delete the file ${title}`)
        console.log(conf)
        let ext = title.split('.')[1]        
        if(conf === true){
            fetch('http://localhost:5000/deleteserver',{
                method: 'POST',
                crossDomain:true,
                headers:{
                    "Content-type":"application/json",
                    Accept:'application/json',
                    "Access-Control-Allow-Origin":"*"
                },
                body: JSON.stringify({title: title, ext: ext})
            })
            .then((res)=>res.json())
            .then((info)=>{
                if(info.status === 'ok'){
                    alert(`Sucessfully deleted the file ${title}`)
                    window.localStorage.setItem("files", info.files)
					// window.localStorage.setItem("fids", info.id)
                }
                else if(info.status === 'error')
                alert("Error occured while deleting. Please try again") 
            })
        }
    }

    newfile(event){
        event.preventDefault()
        let input = document.getElementById("inputhi7")
        if(input.value.includes('.'))
        alert("Dots are not included")
        else{
            var files = window.localStorage.files
            var fileiter = files.split(',')
            console.log(fileiter)
            let point = 0
            for(var i=0; i< fileiter.length; i++){
                if(input.value === fileiter[i]){
                    alert("Filename exists. Please change the file name")
                    point = 1
                }
            }
            const input = document.getElementById("inputhi5")
            var password = ''
            if(input.disabled === false){
                password = input.value
            }
            if(point === 0){
                fetch('http://localhost:5000/newfileserver',{
                    method: 'POST',
                    headers:{
                        "Content-type":"application/json",
                        Accept:'application/json',
                    },
                    body: JSON.stringify({title: input.value, password: password})
                })
                .then((res) => res.json())
                .then((info) => {
                    console.log(info.status)
                    if(info.status === 'ok'){
                        alert('File created successfully')
                        window.localStorage.setItem('files',info.files)
                        // window.localStorage.setItem('fids', info.id)
                        window.localStorage.setItem("currentfid", info.cid)
                        window.localStorage.setItem("currentfile",info.ctitle)
                        window.location.assign('./editor')
                    }
                    else if(info.status === 'filerror'){
                        alert("Please select the file")
                    }
                    else if(info.status === 'error'){
                        alert("Sorry, we couldn't upload the file")
                    }
                })
            }
        }
    }

    sort(event){
        event.preventDefault()
        const select1 = document.getElementById("selecthi2")
        const select2 = document.getElementById("selecthi3")
        if(select1.value === "Sort by" || select1.value === "Ascending")
        var value = "Ascending"
        else if (select1.value === "Descending")
        var value = "Descending"
        fetch('http://localhost:5000/sortserver',{
            method: 'POST',
            headers:{
                "Content-type":"application/json",
                Accept:'application/json',
            },
            body: JSON.stringify({sort_by: value, group_by: select2.value})
        })
        .then((res) => res.json())
        .then((info) => {
            console.log(info.status)
            if(info.status === 'ok'){
                window.localStorage.setItem('files',info.files)
                // window.localStorage.setItem('fids', info.id)
                // window.location.assign('./home')
            }
            else if(info.status === 'error'){
                alert("Error occured. Please try again")
            }
        })
    }

    selectchange(event, variable){
        if(variable === 'upload' && event.target.value == 'Yes'){
            const input = document.getElementById("inputhi4")
            input.disabled = false
        }
        else if(variable === 'upload' && event.target.value === 'No'){
            const input = document.getElementById("inputhi4")
            input.disabled = true
        }
        else if(variable === 'new' && event.target.value === 'No'){
            const input = document.getElementById("inputhi5")
            input.disabled = true
        }
        else if(variable === 'new' && event.target.value === 'Yes'){
            const input = document.getElementById("inputhi5")
            input.disabled = false
        }
    }

    render(){
        var fileitems = window.localStorage.files;
        var fileid = window.localStorage.fids;
        var fileiter = fileitems.split(',')
        var fileiditer = fileid.split(',')
        return<div>
            <div id="divh1">
                <div id="divh2">Welcome <br></br>{window.localStorage.name} <br></br>
                <span id="spanh1">ProfileID: FN001</span>
                </div>
                <img id="imgh1" src={require('./user.png')} alt='logo'/>
                {/* <div id="divh3">
                        <button className="buttonh1">My Profile</button>
                        <button className="buttonh1">Change Profile</button>
                        <button className="buttonh1">Storage</button>
                        <button className="buttonh1">Settings</button>
                        <button className="buttonh1">Logout</button>
                </div> */}
            </div>
            <div id="sidebar" style={{left: this.state.sidestyle}}>
                <ul className="ul">
                    <li className="texth1">ProfileID: FN0001</li><br></br>
                    <li><Link to='/home'><button className="buttonh2">Home</button></Link></li>
                    <li><Link to='/groups'><button className="buttonh2">Groups</button></Link></li>
                    <li><Link to='/account'><button className="buttonh2">My Account</button></Link></li>
                    <li><button className="buttonh2">Change Profile</button></li>
                    <li><Link to='/document'><button className="buttonh2">Documents</button></Link></li>
                    <li><Link to='/imagesvideos'><button className="buttonh2">Images and Videos</button></Link></li>
                    <li><Link to='/audio'><button className="buttonh2">Audio</button></Link></li>
                    <li><Link to='/logout'><button className="buttonh2">Logout</button></Link></li>
                </ul>
            </div>
            <div id="divh5">
                <div>
                    {/* <input id="inputh1" placeholder="Search your files here"/> */}
                    <button className="buttonh3" id="buttonhi1" onClick={(e)=>this.create(e, 'divh6')}>Create file</button>
                    <button className="buttonh3" id="buttonhi2" onClick={(e)=>this.create(e, 'divh4')}>Upload file</button>
                </div>
                <span id="spanh2">All Files</span>
                {/* <select className="selecth1" id="selecthi1">
                    <option>Type</option>
                    <option>All Files</option>
                    <option>Documents</option>
                    <option>Images and Videos</option>
                    <option>Audio</option>
                </select> */}
                <select className="selecth1" id="selecthi2" onChange={this.sort}>
                    <option>Sort by</option>
                    <option>Ascending</option>
                    <option>Descending</option>
                </select>
                <select className="selecth1" id="selecthi3" onChange={this.sort}>
                    <option>Group by</option>
                    <option>Name</option>
                    <option>Type</option>
                    <option>Size</option>
                    <option>Last Modified</option>
                    <option>Date Created</option>
                </select>
        </div>
        <div id="divh6">
            <span id="spanh3">Write the name of the new file</span>
            <button id="buttonhi3" onClick={this.close}>&#x274C;</button>
            <input id="inputhi7" className="inputh2" placeholder="File Name" autocomplete="off" required></input>
            <span id="spanh5">Password protected: </span>
            <select id="selecthi5" onChange={(e)=>this.selectchange(e, 'new')}>
                <option selected>No</option>
                <option>Yes</option>
            </select>
            <input className="inputh2" id="inputhi5" disabled required placeholder="Password"/>
            <button id="buttonhi7" onClick={this.newfile}>Create a file name</button>
        </div>
            <div id="divh4">
                <span id="spanh3">Click on Select to select the file</span>
                <button id="buttonhi3" onClick={this.close}>&#x274C;</button>
                <label htmlFor="inputhi3" id="labelhi1">Select</label>
                <input className="inputh2" id="inputhi1" disabled/>
                <input className="inputh2" id="inputhi2" disabled/>
                <span id="spanh4">Password protected: </span>
                <select id="selecthi4" onChange={(e)=>this.selectchange(e, 'upload')}>
                    <option selected>No</option>
                    <option>Yes</option>
                </select>
                <input className="inputh2" id="inputhi4" disabled required placeholder="Password"/>
                <input type="file" onChange={this.handlefile} id="inputhi3" style={{display: 'none'}}/>
                <button id="buttonhi4" onClick={this.upload}>Upload to Server</button>
            </div>
            {window.localStorage.files === 'none' ?
            (<div id="filesh1"><div className="divfile">You don't have any files. Create or upload and then it will be shown here.</div></div>):
            (<div id="filesh1"><div className="divfile">{/*<span className="spanhid"><b>FileId</b></span>*/}
            <span className="spanhfname"><b>File Name</b></span>
            {/* <span className="spansize"><b>Size  </b></span> */}
            </div>
                {fileiter.map((title, index)=>{
                return<div className='divfile'>
                        {/* <span className="spanhid">{fileiditer[index]}</span> */}
                        <span className="spanhfname" onClick={(e)=>this.send(e, title, fileiditer[index])}>{title}</span>
                        {/* <span className="spansize" onClick={(e)=>this.send(e, title)}>Hi</span> */}
                        <span className="spandelete"><button id="deletebutton" onClick={(e)=>this.delete(e, title)}><img id='delete' src={require('./delete.png')}/></button></span>
                    </div>})}
                </div>)}
        </div>
    }
}

export default Home