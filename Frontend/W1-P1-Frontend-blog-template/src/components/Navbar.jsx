import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const NavbarCon = () => {
    const { user, logout } = useAuth();


    const defaultProfilePicture = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`; // URL dell'immagine di profilo predefinita

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Blog</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            
                            <>
                            <div className="d-flex align-items-center">
                            <Image

                            src={defaultProfilePicture}
                            roundedCircle   
                            width={40}
                            height={40}
                            className="me-2"
                            />
                            <NavDropdown title={`Ciao,${user.firstName} ${user.lastName}`} 
                            id="basic-nav-dropdown"
                            align="end"
                            >

                            <NavDropdown.Item as ={Link} to="/create">Crea Post</NavDropdown.Item>

                            <NavDropdown.Item as ={Link} to="/my-posts">I Miei Post</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as ={Link} to="/profile">Gestisci Profilo</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as ={Link} onClick={logout} to="/create">Log out</NavDropdown.Item>

                            </NavDropdown>

                            </div>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarCon;