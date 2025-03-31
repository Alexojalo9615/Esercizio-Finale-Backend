import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        cover: null,
        content: "",
        readTime: {
            value: "",
            unit: "minutes",
        }
    });

    const [coverImage, setCoverImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Crea un'anteprima dell'immagine
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verifica se l'utente è autenticato
            if (!user || !user._id) {
                setError("Devi essere loggato per creare un post");
                return;
            }

            if (!coverImage) {

                setError("Devi caricare un'immagine di copertura");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("cover", coverImage); // Aggiungi il file
            formDataToSend.append("content", formData.content);
            formDataToSend.append("readTime", JSON.stringify({
                value: parseInt(formData.readTime.value),
                unit: formData.readTime.unit
            }));; // Converti l'oggetto in stringa JSON
            formDataToSend.append("author", user._id);

            console.log("Dati inviati:", formDataToSend.get("cover"));

            const response = await axios.post("http://localhost:5020/posts", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });


            if (response && response.data) {
                console.log("Post creato con successo:", response.data);
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Errore nella creazione del post");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center mt-5">
                <Col xs={12} md={6}>
                    <h1>Crea un nuovo post</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit} >
                        <Form.Group className="mb-3">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci il titolo"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci la categoria"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cover</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Anteprima"
                                    className="mt-2"
                                    style={{ maxWidth: "200px" }}
                                />
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contenuto</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Inserisci il contenuto"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        content: e.target.value,
                                    })
                                }
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tempo di lettura</Form.Label>
                            <Row>
                                <Col xs={8}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Inserisci il tempo di lettura"
                                        value={formData.readTime.value}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                readTime: {
                                                    ...formData.readTime,
                                                    value: e.target.value,
                                                },
                                            })
                                        }
                                        required
                                    />
                                </Col>
                                <Col xs={4}>
                                

                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Crea Post
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
};

export default CreatePost;