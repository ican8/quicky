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

class NewCompany extends Component {
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
        } else {
          window.alert("Smart contract not deployed to detected network.");
        }
      }

  constructor(props) {
    super(props);
    this.state = {
      identityHash: "",
      name: "",
      website: "",
      contract: null,
      web3: null,
      buffer: null,
      account: null,
    };
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

  captureName = (event) => {
      this.setState({name: event.target.value})
  }

  captureWebsite = (event) => {
    this.setState({website: event.target.value})
  }

  onSubmit = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    if (this.state.buffer){
      try{
        const postResponse = await ipfs.add(this.state.buffer) 
        console.log("postResponse", postResponse);
        // this.setState({identityHash: postResponse.path})
        console.log('Creating company -',this.state.name)
        // let curr_users = await this.state.contract.methods.getPersonCount().call();
        // console.log('Blockchain data  -',curr_users)
        this.state.contract.methods.createCompany(this.state.name,postResponse.path,this.state.website)
        .send({ from: this.state.account })
        .then((r) => {
            console.log(r,'User ',this.state.name,'created!')
          })

      } catch(e){
        console.log("Error: ", e)
      }
    } else{
      alert("No files submitted. Please try again.");
      console.log('ERROR: No data to submit');
    }
  }

  render() {
    return (
      <Form id="myForm" onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3>
                  <center>Company Account</center>
                </h3>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Row>
                    <Label for="name"> Name</Label>
                    <Input
                      type="text"
                      onChange={this.captureName}
                      value={this.name}
                      name="name"
                      required
                    />
                  </Row>
                  <Row>
                    <Label for="identity">Identity Proof</Label>
                    <Input
                      type="file"
                      onChange={this.captureFile}
                      name="identity"
                      required
                    />
                  </Row>
                  <Row>
                    <Label for="website"> Website</Label>
                    <Input
                      type="text"
                      onChange={this.captureWebsite}
                      value={this.website}
                      name="website"
                      required
                    />
                  </Row>
                </FormGroup>

                <FormGroup>
                  <Row className="d-flex justify-content-center">
                    <input type="submit" />
                  </Row>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default NewCompany;
