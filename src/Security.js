import React from 'react';
import './Security.css';

class Security extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            options : ["What city were you born in?","What was the title of the first book you read?",
            "What is the name of a college you applied to but didn't attend?","What was the name of your first stuffed toy?",
            "What was your maths teacher's name in your 8th year of school?","What is your favorite movie?",
            "What is your favorite number?","What school did you attend for sixth grade?",
            "What was your childhood nickname?","What is your oldest cousin's first and last name?",
            "What is your oldest sibling's middle name?","In what city does your nearest sibling live?"
            ],
            option1: "",
            option2: "",
            answer1: "",
            answer2: ""
        };
        this.security = this.security.bind(this)
    }
    security(event){
        event.preventDefault()
        let option1 = document.getElementById('question1');
        let option2 = document.getElementById('question2');
        if(option1.value === "Select the Question" && option2.value === "Select the Question")
        alert("Choose the question 1 & 2")
        else if(option1.value === "Select the Question")
        alert("Please choose the question 1")
        else if(option2.value === "Select the Question")
        alert("Please choose the question 2")
        else if(this.state.answer1 === "" && this.state.answer2 === "")
        alert("Please enter the answers")
        else if(this.state.answer1 === "" || this.state.answer2 === "")
        alert("Please enter the answer")
        else if(this.state.answer1 === " " || this.state.answer1 === "  ")
        alert("Space is not a valid answer")
        else if(this.state.answer2 === " " || this.state.answer2 === "  ")
        alert("Space is not a valid answer")
        else{
            const o1 = option1.value
            const o2 = option2.value
            const a1 = this.state.answer1
            const a2 = this.state.answer2
            fetch('http://localhost:5000/securityserver',{
                method:"POST",
                crossDomain:true,
                headers:{
                    "Content-type":"application/json",
                    Accept:'application/json',
                    "Access-Control-Allow-Origin":"*"
                },
                body: JSON.stringify({
                   o1, a1, o2, a2 
                }),
            })
            .then((res)=> res.json())
            .then((info)=>{
                if(info.status === 'ok'){
                    alert("Saved Successfully")
                    window.location.assign('/login')
                }
                else if(info.status === 'error'){
                    alert("Error occcured while saving")
                }
            })
        }
    }
    render(){
        return<div>
            <span id='spanse1'>Security Questions</span>
            <div id="security">
                <form onSubmit={this.security}>
                    <span id='text'>These are the questions which will be asked if you forget the password.<br></br>
                        Choose the questions wisely and cautiously so that no other person should change it
                    </span>
                    <select name='security1' id='question1' onChange={(option) => this.setState({ option1: option.target.value })}>
                        <option>Select the Question</option>
                        {this.state.options.map((option, index) =>{
                        if(option!== this.state.option2){
                        return(<option key={index} value={option}>{option}</option>);}})}
                    </select>
                    <input id='ans1' required placeholder='Answer' onChange={(answer) => this.setState({ answer1: answer.target.value})} autoComplete="off"/>
                    <select name='security2' id='question2' onChange={(option) => this.setState({ option2: option.target.value })}>
                        <option>Select the Question</option>
                        {this.state.options.map((option, index) =>{ 
                        if(option!== this.state.option1){
                        return(<option key={index} value={option}>{option}</option>);}})}
                    </select>
                    <input id='ans2' required placeholder='Answer' onChange={(answer) => this.setState({ answer2: answer.target.value})} autoComplete="off"/>
                    <button id='Proceed'>Proceed</button>
                </form>
            </div>
        </div>
    }
}

export default Security