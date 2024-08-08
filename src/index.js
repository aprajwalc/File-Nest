import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './index.css';
import Front from './Front';
import Login from './Login';
import Signup from './Signup';
import Security from './Security';
import Home from './Home';
import Player from './Player';
import Account from './Account';
import Groups from './Groups'
import File from './File'
import Test from './test'
import Editors from './Editor';
import Document from './Document';
import IVideos from './IVideos';
import Audio from './Audio';
import Logout from './Logout';
import Admin from './Admin';
import FileSecurity from './FileSecurity';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Front/>}/></Routes>
    <Routes>
    <Route path='/login' element={<Login/>}/></Routes>
    <Routes>
    <Route path = '/signup' element={<Signup/>}/></Routes>
    <Routes>
    <Route path = '/security' element={<Security/>}/></Routes>
    <Routes>
    <Route path = '/home' element={<Home/>}/></Routes>
    <Routes>
    <Route path = '/player' element={<Player/>}/></Routes>
    <Routes>
    <Route path = '/account' element={<Account/>}/></Routes>
    <Routes>
    <Route path = '/groups' element={<Groups/>}/></Routes>
    <Routes>
    <Route path = '/test' element={<Test/>}/></Routes>
    <Routes>
    <Route path = '/file' element={<File/>}/></Routes>
    <Routes>
    <Route path = '/editor' element={<Editors/>}/></Routes>
    <Routes>
    <Route path = '/document' element={<Document/>}/></Routes>
    <Routes>
    <Route path = '/imagesvideos' element={<IVideos/>}/></Routes>
    <Routes>
    <Route path = '/audio' element={<Audio/>}/></Routes>
    <Routes>
    <Route path = '/logout' element={<Logout/>}/></Routes>
    <Routes>
    <Route path = '/admin' element={<Admin/>}/></Routes>
    <Routes>
    <Route path = '/filesecurity' element={<FileSecurity/>}/></Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
