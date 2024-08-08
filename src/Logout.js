import React from "react";

class Logout extends React.Component{

    componentDidMount(){
        window.localStorage.clear()
        window.location.assign('./login')
    }

    render(){
        return<div>Logging out</div>
    }
}

export default Logout