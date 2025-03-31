import { useState, useEffect } from "react";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import PostCard from "../components/PostCard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Stato per il caricamento
    const [error, setError] = useState(null); // Stato per gli errori
    const [page, setPage] = useState(1); // Stato per la paginazione
    const [totalPages, setTotalPages] = useState(0); // Stato per il numero totale di pagine

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true); // Imposta loading a true prima di iniziare la richiesta
                const response = await axios.get(`http://localhost:5020/posts?page=${page}&limit=2`); // Aggiungi il parametro della pagina
                console.log(response.data);
                setPosts(response.data.posts); // Assicurati che `posts` sia il nome corretto nel payload
                setTotalPages(response.data.totalPages); // Assicurati che `totalPages` sia presente nella risposta
                setLoading(false); // Imposta loading a false dopo aver ricevuto i dati
            } catch (err) {
                setError(err.message); // Imposta l'errore in caso di problemi
                setLoading(false); // Imposta loading a false anche in caso di errore
            }
        };
        fetchPosts();
    }, [page]); // Aggiungi `page` come dipendenza per aggiornare i dati quando cambia la pagina

    return (
        <Container className="mt-5">
            {loading && <h1>Caricamento...</h1>} {/* Mostra il messaggio di caricamento */}
            {error && <h1>Errore: {error}</h1>} {/* Mostra il messaggio di errore */}
        
            <Row>
                {!loading && posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Col key={post._id} md={4}>
                            <PostCard post={post} />
                        </Col>
                    ))
                ) : (
                    !loading && !error && (
                        <Col>
                            <h1>Non ci sono post</h1>
                        </Col>
                    )
                )}
            </Row>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        />
                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Item
                                key={idx + 1}
                                active={idx + 1 === page}
                                onClick={() => setPage(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        />
                    </Pagination>
                </div>
            )}
        </Container>
    );
};

export default Home;