import React from "react";
import {Link} from 'react-router-dom'
import './Editor.css'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw, ContentState} from "draft-js";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { saveAs } from 'file-saver';
import htmlToDraft from 'html-to-draftjs';
import { stateToHTML } from 'draft-js-export-html';
import jsPDF from 'jspdf';

class Editors extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
		};
		this.renamefile = this.renamefile.bind(this)
		this.download = this.download.bind(this)
		this.savefile = this.savefile.bind(this)
	}

	onEditorStateChange = (newEditorState) => {
		this.setState({ editorState: newEditorState });
	};

	componentDidMount(){
		fetch('http://localhost:5000/retrieveserver', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				Accept: 'application/json'
			},
			crossDomain: true,
			body: JSON.stringify({ fileid: window.localStorage.getItem('currentfid'), value: 0 })
		})
		.then((res)=>res.json())
        .then((info)=>{
			// console.log(convertFromRaw(JSON.parse(info.text)))
			if(info.status === 'ok'){
				if(info.state === 1)
					this.setState({editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(info.text)))})
			}
			else if(info.status === 'error')
			alert("Error occured")
		})
	}

	renamefile(event){
		event.preventDefault()
		const inputei1 = document.getElementById('inputei1')
		const rename = document.getElementById('buttonei5')
		const save = document.getElementById('buttonei6')
		if(inputei1.disabled === true){
			inputei1.disabled = false
			var k = inputei1.value
			console.log(save.style.display)
			if(save.style.display === 'none'){
				rename.style.display = 'none'
				save.style.display = 'block'
			}
		}
		else if(inputei1.disabled === false){
			inputei1.disabled = true
			if(save.style.display === 'block'){
				rename.style.display = 'block'
				save.style.display = 'none'
			}
			if(inputei1.value !== window.localStorage.currentfile){
				var filename = inputei1.value
				var files = window.localStorage.files.split(',')
				var flag = 0
				console.log(files)
				for (var i=0; i< files.length; i++){
					if(filename === files[i].split('.')[0]){
						alert("Filename exists. Same name cannot be given to 2 files")
						var flag = 1
						inputei1.value = window.localStorage.currentfile.split('.')[0]
						inputei1.disabled = true
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
					body: JSON.stringify({ fileid: window.localStorage.getItem('currentfid'), name: inputei1.value, ext: window.localStorage.currentfile.split('.')[1] })
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
			inputei1.disabled = true
			save.style.display = 'none'
			rename.style.display = 'block'
		}
		}
	}

	savefile(event, rawcontent){
		console.log(rawcontent)
		event.preventDefault()
		fetch('http://localhost:5000/savefileserver',{
				method:"POST",
				crossDomain:true,
				headers:{
					"Content-type":"application/json",
					Accept:'application/json',
					"Access-Control-Allow-Origin":"*"
				},
				body: JSON.stringify({fileid: window.localStorage.currentfid, content:rawcontent}),
		})
		.then((res) => res.json())
		.then((info) => {
			console.log(info.status)
			if(info.status === 'ok'){
				alert('File is saved')
				window.location.assign('./editor')
			}
			else if(info.status === 'error'){
				alert("Sorry, we couldn't save the file")
			}
		})
	}

	download(event, value){
		event.preventDefault()
		const { editorState } = this.state;
		const div = document.getElementById("inputei1")
		const filename = div.value
		console.log(value)
		if(value === 'txt'){
			const plainTextContent = editorState.getCurrentContent().getPlainText('\u0001');
			console.log(plainTextContent)
			const blob = new Blob([plainTextContent], { type: 'text/plain;charset=utf-8' });
			saveAs(blob, `${filename}.txt`);
		}
		else if(value === 'pdf'){
			const htmlContent = stateToHTML(editorState.getCurrentContent());
			const contentBlock = htmlToDraft(htmlContent);
    		const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const plainTextContent = contentState.getPlainText('\u0001');
			const pdf = new jsPDF();
			pdf.text(plainTextContent, 10, 10);
			pdf.save(`${filename}.pdf`);
		}
	}

	render() {
		const {editorState} = this.state;
		const rawcontent = convertToRaw(editorState.getCurrentContent())
		return <div>
			<div id="editor">
			<Editor
				editorState={editorState}
				wrapperClassName="editor-wrapper"
				editorClassName="editor-content"
				onEditorStateChange={this.onEditorStateChange}
			/>
			</div>
			<div><input disabled id='inputei1' defaultValue={window.localStorage.currentfile}/>
				<button id='buttonei5' className= "buttone5" onClick={this.renamefile}><img src={require('./pencil.png')} className='imgside'/></button>
				<button id='buttonei6' className='buttone5' style={{display: 'none'}}><img src={require('./check.png')} className='imgside'/></button>
				<button id="buttonei7" onClick={(event)=>this.savefile(event, rawcontent)}>Save File</button></div>
				<button id="buttonei8" onClick={(event)=>this.download(event, 'txt')}>Download</button>
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
				</div>
		</div>
	}
}

export default Editors