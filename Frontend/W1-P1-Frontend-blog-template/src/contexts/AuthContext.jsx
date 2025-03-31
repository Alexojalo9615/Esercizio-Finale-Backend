import { createContext, useContext, useState } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user"); // localStorage.getItem() è un metodo che restituisce il valore di una chiave specifica dal LocalStorage. In questo caso stiamo cercando la chiave "user".
        return savedUser ? JSON.parse(savedUser) : null; // JSON.parse() è un metodo che converte una stringa JSON in un oggetto JavaScript. In questo caso stiamo convertendo la stringa JSON restituita da localStorage.getItem() in un oggetto JavaScript. Se non c'è alcun valore salvato con la chiave "user" restituiamo null.
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Per capire meglio il LocalStorage ha una key che è una stringa e rappresenta il nome della chiave e il secondo valore è il valore che vogliamo salvare, in questo caso l'oggetto userData. LocalStorage può memorizzare solo stringhe quindi se si desidera slavare un oggetto è necessario convertirlo in una strigna JSON prima. 
        // JSON.strignify() è un metodo che converte un oggetto JavaScript in una stringa JSON.
    };

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user"); // Rimuove l'elemento con la chiave "user" dal LocalStorage
    };


    return (
        <AuthContext.Provider value={{ user, login, logout }} // AuthContext.Provider è un componente che accetta un valore "value" che sarà passato a tutti i componenti figli. In questo caso il valore è un oggetto con le chiavi "user", "login" e "logout". é un meccanismo che non prevede l'utilizzo delle props 
        >  {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    return useContext(AuthContext);
}


    ;