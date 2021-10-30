import React, { Component } from "react";
import Web3 from "web3";
import { Spinner } from "reactstrap";
import Quicky from "../abis/Quicky.json";
export default class HomePage extends Component {
  async componentWillMount() {
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
  constructor(props) {
    super(props);
    this.state = {
      identityHash: "",
      name: "",
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      accountType: null,
    };
  }

  render() {

    if (this.state.accountType === "person") {
      return (
        <div>
          <h1>Person</h1>
        </div>
      );
    } else if (this.state.accountType === "company") {
      return (
        <div>
          <h1>Company</h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Default</h1>
        </div>
      );
    }
  }
}
