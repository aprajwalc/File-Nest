import React from "react";
import { Link } from "react-router-dom";
import './IVideos.css'

class IVideos extends React.Component{
    constructor(props){
		super(props)
		this.state = {
			files: null, 
            fileids: null
		};
        this.send = this.send.bind(this)
        this.delete = this.delete.bind(this)
        this.middle = this.middle.bind(this)
	}
    componentDidMount(){
        fetch('http://localhost:5000/specificserver',{
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-type":"application/json",
                Accept:'application/json',
                "Access-Control-Allow-Origin":"*"
            },
            body: JSON.stringify({value: "imagevideo"}),
        })
        .then((res) => res.json())
        .then((info) => {
            console.log(info.status)
            if(info.status === 'ok'){
                if(info.files == 'none'){
                    this.setState({files: null, fileids: null})
                }
                this.setState({files: info.files, fileids: info.fids})
            }
            else if(info.status === 'error'){
                alert("Sorry, error occured")
            }
        })
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
                    window.location.assign('./imagesvideos')
					// window.localStorage.setItem("fids", info.id)
                }
                else if(info.status === 'error')
                alert("Error occured while deleting. Please try again") 
            })
        }
    }

    middle(){
        if(this.state.files){
            var files = this.state.files;
            var fileids = this.state.fileids;
            return files.map((title, index)=>{
                return<div className='docsfile'>
                        <span className="spandname" onClick={(e)=>this.send(e, title, fileids[index])}>{title}</span>
                        <span className="spanddelete"><button id="deletebutton" onClick={(e)=>this.delete(e, title)}><img id='delete' src={require('./delete.png')}/></button></span>
                    </div>})
        }
        else{
            return <div className='docsfile'>No documents to display</div>
        }
    }

    render(){
        return<div><span id="spandocs1">Images and Videos</span>
            <div id="docsdiv">
                {this.middle()}
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

export default IVideos