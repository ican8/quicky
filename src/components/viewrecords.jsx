import React, { useState, useEffect, Component } from "react";
// import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  CardTitle,
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

var recordTable = [];

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
      // let is_company = contract.methods.check_is_company().call({ from: accounts[0] });
      // if(is_company){
      //   console.log("This is company account");
      //   var company_name = contract.methods.getName().call({from: accounts[0]})
      // }
      let company_name = await contract.methods.getName(accounts[0]).call()
      if(company_name){
        console.log('Company name = ',company_name);
        this.state.name = company_name;
      }
      await this.fetchRecords();
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
      records: [],
    };
  }

  fetchRecords = async () => {
    console.log("fetching records");
    let n = await this.state.contract.methods.getRecordCount().call();
    console.log("got ",Number(n)," records");
    n = Number(n);
    for (let i = 0; i < n; i++) {
      let rec = await this.state.contract.methods.getRecord(i).call();
      console.log("Record fetched => ",rec);
      if( rec[2] == this.state.name ){
        recordTable.push(
          <tr>
            <td>{i}</td>
            <td>{rec[0]}</td>
            <td>{rec[1]}</td>
            <td>{rec[3].toString()}</td>
            <td>
              <Button
              >
                Approve 
              </Button>
            </td>
          </tr>
        );
      }
    }
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Records</CardTitle>
        </CardHeader>
        <CardBody>
          <Table className="tablesorter" responsive color="black">
            <thead className="text-primary">
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Proof</th>
                <th>Request Status</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>{recordTable}</tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

export default ViewRecords;
