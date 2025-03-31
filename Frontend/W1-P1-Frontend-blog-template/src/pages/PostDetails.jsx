import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const PostDetails = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuth

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5020/posts/${id}`);
                setPost(response.data);
                console.log(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching post:", err.message);
                setError("Errore nel recupero del post:");
                setPost({});
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Sei sicuro di voler eliminare questo post?")) { // Aggiungi conferma prima di eliminare
            try {
                await axios.delete(`http://localhost:5020/posts/${id}`);
                navigate('/my-posts'); // Reindirizza alla pagina "I Miei Post"
            } catch (err) {
                setError("Errore nella cancellazione del post");
            }
        }
    };

    const isAuthor = user && post && post.author && user._id === post.author._id; // Verifica se l'utente è l'autore del post

    return (
        <Container className="mt-5">
            {loading && <h1>Caricamento...</h1>}
            {error && <h1>Errore: {error}</h1>}
            {post && post._id && (
                <Row>
                    <Col md={8}>
                        <h1>{post.title}</h1>
                        {isAuthor && (
                            <div>
                                <Button
                                    variant="outline-primary"
                                    className="me-2"
                                    onClick={() => navigate(`/edit/${post._id}`)}
                                >
                                    Modifica
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={handleDelete}
                                >
                                    Elimina
                                </Button>
                            </div>
                        )}
                        <p>{post.content}</p>
                    </Col>
                    <Col md={4}>
                        <img src={post.cover} alt={post.title} style={{ width: "100%" }} />
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default PostDetails;