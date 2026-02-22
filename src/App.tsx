import { useState, useEffect } from "react";
import { type MatrixUser } from "./types";
import { register, joinRoom } from "./matrixRequests";

function storeUser(user: MatrixUser) {
  localStorage.setItem("deviceMatrixUser", JSON.stringify(user));
}

function loadUser() {
  const userString = localStorage.getItem("deviceMatrixUser");

  if (userString) {
    return JSON.parse(userString);
  }

  return undefined;
}

async function registerUser() {
  const user = await register();

  return user;
}

function App() {
  const [deviceMatrixUser, setDeviceMatrixUser] = useState<
    MatrixUser | undefined
  >();
  const [users, setUsers] = useState<[]>([]);

  useEffect(() => {
    const user = loadUser();
    if (user) {
      setDeviceMatrixUser(user);
    } else {
      registerUser().then((user) => {
        storeUser(user);
        setDeviceMatrixUser(user);
        joinRoom(user);
      });
    }
  }, []);

  useEffect(() => {
    sync();
  }, [deviceMatrixUser]);

  function sync() {
    console.log("get that syncing feeling");
  }

  return (
    <>
      <section id="purple"></section>
      <section id="orange"></section>
      <section id="blue"></section>
      <section id="green"></section>
      <div id="me" className="online" />
    </>
  );
}

export default App;
