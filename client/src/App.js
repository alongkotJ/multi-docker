import React from 'react'; 
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Fib from "./Fib";
import OtherPage from "./OtherPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload. ==> V.3</p>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
          <div>
            <Route exact path="/" component={Fib} /> 
            <Route exact path="/otherpage" component={OtherPage} />
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
