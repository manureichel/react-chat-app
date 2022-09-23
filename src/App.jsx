import React from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBRO4UMhxyQvc3F1JFVPgpmOLbM4EmRF-w",
  authDomain: "manu-chat-app.firebaseapp.com",
  projectId: "manu-chat-app",
  storageBucket: "manu-chat-app.appspot.com",
  messagingSenderId: "525136251470",
  appId: "1:525136251470:web:79c19deba3d533d1c1111f",
  measurementId: "G-MG2YJ51GFL",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header>
        <h1>Vamocharla</h1>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Iniciar Sesión con Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button onClick={() => auth.signOut()}>Cerrar Sesión</button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = React.useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <div>
      <div>
        {messages &&
          messages.map((msg) => (
            <ChatMessage key={msg.createdAt} message={msg} />
          ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <button type="submit" onSubmit={sendMessage}>
          Enviar
        </button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const name = auth.currentUser.displayName;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div>
      <div style={{ display: "flex" }}>
        <img src={photoURL} alt="" />
        <h1>{name}</h1>
      </div>
      <p>{text}</p>
    </div>
  );
}

export default App;
