import React, { useState, useEffect, Component } from "react";
// import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { create, urlSource } from "ipfs-http-client";
import Web3 from "web3";
import Quicky from "../abis/Quicky.json";
const ipfs = create(new URL("https://ipfs.infura.io:5001"));

class ViewRecords extends Component {
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
        //   let is_company = contract.methods.check_is_company();
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
      records : []
    };
  }

  fetchRecords = async () => {
    let n = await this.state.contract.methods.getRecordCount().call();
    for(let i = 0; i < n; i++){
        this.state.contract.methods.getRecord(i).call();
    }
  }

 

  render() {
    return (
      <h1>Records</h1>
    );
  }
}

export default ViewRecords;
