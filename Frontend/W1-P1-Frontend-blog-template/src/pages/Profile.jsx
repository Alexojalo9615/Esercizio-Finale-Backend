import { useState } from "react";
import { Row, Col, Form, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                setError("Le password non corrispondono");
                return;
            }
            const response = await axios.put(`http://localhost:5020/users/${user._id}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            login(response.data); // Aggiorna il contesto con i nuovi dati dell'utente  
            setSuccess("Profilo aggiornato con successo!");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Errore nell'aggiornamento del profilo");
            setSuccess("");
        } finally {
            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2>Aggiorna Profilo</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                            />
                        </Form.Group>

                        <h4 className="mt-4">Modifica Password</h4>

                        <Form.Group controlId="currentPassword">
                            <Form.Label>Password Attuale</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label>Nuova Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Conferma Nuova Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Aggiorna Profilo
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;