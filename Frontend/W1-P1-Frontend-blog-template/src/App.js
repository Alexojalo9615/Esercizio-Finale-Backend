import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./index.css"; // Importa il file CSS

function App() {

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [message, setMessage] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [showUsers, setShowUsers] = useState(true); // Stato per controllare la visualizzazione degli utenti
  const API_URL = "http://localhost:5020/users";


  //GET
  const fetchUsers = async () => {

    try {

      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {

    fetchUsers();
  }, []);

  //POST

  const addUsers = async () => {
    try {
      const response = await fetch(API_URL, {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description })
      });
      const data = await response.json();
      setUsers((prev) => [...prev, data]); // 'prev' rappresenta l'array users prima dell'aggiornamento, 'data' è il nuovo utente aggiunto 
      setName("");
      setDescription("");

    } catch (err) {
      console.error(err);
    }
  }

  //DELETE
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        setMessage("User cancellato con successo");
      } else {
        setMessage("Fallimento nel cancellare l'user");
        console.error("Fallimento nel cancellare l'user");
      }
    } catch (err) {
      setMessage("Errore nel cancellare l'user");
      console.error(err);
    }
  }

  //PUT
  const updateUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: updateName, description: updateDescription })
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prev) => prev.map((user) => (user._id === id ? updatedUser : user))); // Nell'operatore ternario, se l'id dell'user è uguale all'id passato come argomento, allora restituisco l'user aggiornato, altrimenti mantiene l'user corrente 
        setMessage("User aggiornato con successo");
      } else {
        setMessage("Fallimento nell'aggiornare l'user");
        console.error("Fallimento nell'aggiornare l'user");
      }
    } catch (err) {
      setMessage("Errore nell'aggiornare l'user");
      console.error(err);
    }
  }

  return (

    <Container className="container">
      <Row>
        <Col>

          <h1>Users</h1>
          {message && <p>{message}</p>}
          {showUsers && (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  {user.name} - {user.description}
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setShowUsers(!showUsers)}>
            {showUsers ? "Nascondi Utenti" : "Mostra Utenti"}
          </button>
        </Col>
      </Row>

      <Col>
        <h2>Add User</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addUsers}>Add User</button>
      </Col>

      <Col>
        <h2>Update User</h2>
        <input
          type="text"
          placeholder="User ID"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Name"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Description"
          value={updateDescription}
          onChange={(e) => setUpdateDescription(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => updateUser(updateId)}>Update User</button>
      </Col>

      <Col>
        <h2>Delete User</h2>
        <input
          type="text"
          placeholder="User ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <button className="btn btn-danger" onClick={() => deleteUser(deleteId)}>Delete User</button>
      </Col>

    </Container>

  );
}

export default App;
