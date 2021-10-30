import React, {Component} from 'react';
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default class MyNavbar extends Component{
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

    render(){
       return <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
          <Container>
            <Navbar.Brand href='#home'>
              <Link to='/'>Quicky</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='ml-auto'>
                <Nav.Link href='#new-user'>
                  <Link to='/new-user'>New User</Link>
                </Nav.Link>  
                <Nav.Link href='#new-user'>
                  <Link to='/new-company'>New Company</Link>
                </Nav.Link>  
                <Nav.Link href='#add-experience'>
                    <Link to='/add-experience'>Add Experience</Link>
                  </Nav.Link>
                  <Nav.Link href='#view-records'>
                    <Link to='/view-records'>View Records</Link>
                  </Nav.Link>  
                {/* { this.state.accountType === 'company' && 
                    <Nav.Link href='#view-records'>
                    <Link to='/view-records'>View Records</Link>
                  </Nav.Link>
                
                }
                {this.state.accountType === 'person' && 
                    <Nav.Link href='#add-experience'>
                    <Link to='/add-experience'>Add Experience</Link>
                  </Nav.Link>
                } */}
                
                <Nav.Link to='#about'>
                  <Link to='/about'>About</Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    }
}
  
