import logo from './logo.svg';
import './App.css';

import Accordion from 'react-bootstrap/Accordion';


import VideoEditor from './pages/VideoEditor/VideoEditor'
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Layout } from 'antd';
const { Header, Content } = Layout;









function App() {
  return (
    //<EventByBootstrap />
    //<EventByAntd />
    //<EventByMui />

    <VideoEditor />


  );
}


export default App;
