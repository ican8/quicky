import React from 'react';
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';

function MyNavbar() {
  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='#home'>
          <Link to='/'>Quicky</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ml-auto'>
            <Nav.Link href='#view-records'>
              <Link to='/view-records'>View Records</Link>
            </Nav.Link>
            <Nav.Link href='#add-experience'>
              <Link to='/add-experience'>Add Experience</Link>
            </Nav.Link>
            <Nav.Link to='#about'>
              <Link to='/about'>About</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;