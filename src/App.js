import logo from './logo.png';
import './App.css';
import React, {Component}  from 'react';
import CampaignManagement from './components/campaignManagement/campaignmanagement'

export class App extends Component{
  
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="mainLogo" alt="logo" />
        </header>
        <CampaignManagement />
      </div>
    );
  }
  
}

export default App;
