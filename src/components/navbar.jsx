import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";


const NavbarComponent = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <img src={require("../static/logo.png")} width={190} height={37}></img>
                </Navbar.Brand>
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
