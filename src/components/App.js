import React, { Component } from 'react';
import Web3 from 'web3';
import Quicky from '../abis/Quicky.json'
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            // target="_blank"
            rel="noopener noreferrer"
          >
            Quicky
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <form>
                  <input type = 'file'/>
                   <hr />
                  <input type = 'submit'/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
