import React, { Component } from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Web3 from "web3";
import Quicky from "../abis/Quicky.json";
import { create, urlSource } from 'ipfs-http-client'
import "./App.css";
import Navbar  from "./navbar";
import HomePage from "./homepage";
import NotFound  from "./notfound";
import NewUser from "./newuser";
import ViewRecords from "./viewrecords"
import AddExperience from "./addexperinece";
import NewCompany from "./newcompany";
// const ipfs = ipfsClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });

const ipfs = create(new URL('https://ipfs.infura.io:5001'))


class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Quicky.networks[networkId];
    if (networkData) {
      const contract = web3.eth.Contract(Quicky.abi, networkData.address);
      this.setState({ contract });
      let is_person = await contract.methods
        .check_is_person(accounts[0])
        .call();
      if (is_person) {
        this.state.accountType = "person";
      } else {
        let is_company = await contract.methods
          .check_is_company(accounts[0])
          .call();
        if (is_company) {
          this.state.accountType = "company";
        }
      }
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  captureFile = (event) => {
    console.log("Capturing file...");
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    if (this.state.buffer){
      try{
        const postResponse = await ipfs.add(this.state.buffer) 
        console.log("postResponse", postResponse);
      } catch(e){
        console.log("Error: ", e)
      }
    } else{
      alert("No files submitted. Please try again.");
      console.log('ERROR: No data to submit');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      accountType: ''
    };
  }

  render() {
    return (
      <div>
        <BrowserRouter>
        <Navbar accountType={this.state.accountType}/>
        <Switch>
          <Route path='/' exact component={HomePage } />
          <Route path='/new-user' exact component={NewUser } />
          <Route path='/new-company' exact component={NewCompany } />
          <Route path='/view-records' exact component={ViewRecords } />
          <Route path='/add-experience' exact component={AddExperience } />
          <Route component={NotFound} />
        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
