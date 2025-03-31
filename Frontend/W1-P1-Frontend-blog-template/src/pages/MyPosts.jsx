import { useState, useEffect } from "react";
import { Row, Col, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import PostCard from "../components/PostCard";

const MyPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5020/posts?author=${user._id}`);
            setPosts(response.data.posts);
        } catch (err) {
            console.error("Errore nel recupero dei post:", err);
            setError("Errore nel recupero dei post");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyPosts();
        }
    }, [user]);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:5020/posts/${postId}`);
            fetchMyPosts(); // Ricarica i post dopo la cancellazione
        } catch (err) {
            console.error("Errore nella cancellazione del post:", err);
            setError("Errore nella cancellazione del post");
        }
    };

    if (loading) return <Container className="mt-5"><h2>Caricamento...</h2></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h2>I Miei Post</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Row>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Col key={post._id} md={6} className="mb-4">
                                    <PostCard 
                                        post={post}
                                        showActions={true}
                                        onDelete={() => handleDelete(post._id)} 
                                    />
                                </Col>
                            ))
                        ) : (
                            <p className="text-center mt-4">Non hai ancora pubblicato nessun post</p>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default MyPosts;
