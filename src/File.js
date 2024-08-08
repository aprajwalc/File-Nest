import React from 'react';
import {Link} from 'react-router-dom';
import './File.css'
import AudioPlayer, {RHAP_UI} from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

class File extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pdf: null,
			image: null,
			docx: null,
			video: null,
			audio: null,
			name: null,
			totalpages : 0,
		};
		this.renderfile = this.renderfile.bind(this);
		this.handlefetch = this.handlefetch.bind(this);
		this.renamefile = this.renamefile.bind(this)
		// this.sidebar = this.sidebar.bind(this);
		// window.addEventListener("mousemove", this.sidebar)
	}

	componentDidMount() {
		this.handlefetch();	
	}

	componentWillUnmount(){
        // window.removeEventListener("mousemove", this.sidebar)
    }

	handlefetch = () =>{
		console.log(window.localStorage.getItem('currentfid'));
		fetch('http://localhost:5000/retrieveserver', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			crossDomain: true,
			body: JSON.stringify({ fileid: window.localStorage.getItem('currentfid'), value: 1 })
		})
			.then((res) => res.blob())
			.then((blob) => {
				const file = new Blob([blob], {type: blob.type})
				if (blob.type === 'application/pdf')
					this.setState({pdf : file})
				else if(blob.type === 'image/jpeg')
					this.setState({image: file})
				else if(blob.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
					this.setState({docx: file})
				else if(blob.type.includes('video'))
					this.setState({video: file})
					else if(blob.type.includes('audio'))
					this.setState({audio: file})
			});
	}

	renamefile(event){
		event.preventDefault()
		const inputfi1 = document.getElementById('inputfi1')
		const rename = document.getElementById('buttonfi5')
		const save = document.getElementById('buttonfi6')
		if(inputfi1.disabled === true){
			inputfi1.disabled = false
			var k = inputfi1.value
			inputfi1.value = k.split('.')[0]
			console.log(save.style.display)
			if(save.style.display === 'none'){
				rename.style.display = 'none'
				save.style.display = 'block'
			}
		}
		else if(inputfi1.disabled === false){
			if(inputfi1.value !== window.localStorage.currentfile.split('.')[0]){
				var filename = inputfi1.value
				var files = window.localStorage.files.split(',')
				var flag = 0
				console.log(files)
				for (var i=0; i< files.length; i++){
					if(filename === files[i].split('.')[0]){
						alert("Filename exists. Same name cannot be given to 2 files")
						var flag = 1
						inputfi1.value = window.localStorage.currentfile.split('.')[0]
						inputfi1.disabled = true
						save.style.display = 'none'
						rename.style.display = 'block'
					}
				}
				if (flag === 0){
					fetch('http://localhost:5000/renameserver', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
					},
					crossDomain: true,
					body: JSON.stringify({ fileid: window.localStorage.getItem('currentfid'), name: inputfi1.value, ext: window.localStorage.currentfile.split('.')[1] })
			})
			.then((res)=>res.json())
			.then((info)=>{
				if(info.status === 'ok'){
					window.localStorage.setItem("currentfile",info.ctitle)
					window.localStorage.setItem("files", info.files)
					window.location.assign('./file')
					// console.log(info)
				}
				else if(info.status === 'error')
				alert("Error occured. Please try again") 
			})
				}
			}
			else{
				inputfi1.disabled = true
				save.style.display = 'none'
				rename.style.display = 'block'
			}
		}
	}
	
	renderfile() {
		const { pdf, image, docx, video, audio } = this.state;
		if (pdf) {
			return (
				<iframe id='pdfile' src={URL.createObjectURL(pdf)}></iframe>
			);
		}
		else if(image){
			return<img id='image' src={URL.createObjectURL(image)}/>
		}
		else if(docx){
			let k = URL.createObjectURL(docx)
			console.log(k)
			return<iframe id="docxfile" srcDoc={URL.createObjectURL(docx)}></iframe>
		}
		else if(video){
			return<video controls id='player'>
                <source src={URL.createObjectURL(video)} />
      		</video>
		}
		else if(audio){
			return<div>
			<img src = {require("./music.jpg")} alt="Audio Icon" id="audio-icon"></img>
			<div id = "audioplayer">
			<AudioPlayer
				src={URL.createObjectURL(audio)}
				autoPlayAfterSrcChange={false}
				showJumpControls={false}
				customAdditionalControls={[]}
				customProgressBarSection={[
				RHAP_UI.CURRENT_TIME,
				RHAP_UI.PROGRESS_BAR,
				RHAP_UI.DURATION,
				]}
      />
			</div>
			</div>
		}
		return <div>File not available</div>
	}
	render() {
		var details = JSON.parse(window.localStorage.details)
		// console.log(details)
		let size = ""
		if(details.size < 1024){
            size = parseInt(details.size)+' bytes'
			console.log(size)
		}
		else{
			details.size = (details.size/1024).toFixed(2)
			console.log(details.size)
			if(details.size < 1024)
			size = parseFloat(details.size)+' KB'
			else{
				details.size = (details.size/1024).toFixed(2)
				console.log(details.size)
				if(details.size < 1024)
				size = parseFloat(details.size)+' MB'
			}
        }
		return (
			<div id='main'>
				<div><input disabled id='inputfi1' defaultValue={window.localStorage.currentfile.split('.')[0]}/>
				<button id='buttonfi5' className= "buttonf5" onClick={this.renamefile}><img src={require('./pencil.png')} className='imgside'/></button>
				<button id='buttonfi6' className='buttonf5' onClick={this.renamefile} style={{display: 'none'}}><img src={require('./check.png')} className='imgside'/></button></div>
				<div>{this.renderfile()}</div>
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
			<div id='detail'>
				<span style={{fontSize: '35px'}}>File Details </span> <br></br><br/>
				FileID: {details.fid} <br/><br/>
				File type: {details.file_type} <br/><br/>
				Size: {size} <br/>
			</div>
			</div>
		);
	}
}

export default File;
