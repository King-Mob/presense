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

function getStyleByZone(zone: number | undefined) {
  if (zone === undefined)
    return {};

  const styles = [{
    left: "25%",
    top: "25%"
  }, {
    left: "75%",
    top: "25%"
  }, {
    left: "25%",
    top: "75%"
  }, {
    left: "75%",
    top: "75%"
  }]

  return styles[zone];
}

function App() {
  const [deviceMatrixUser, setDeviceMatrixUser] = useState<
    MatrixUser | undefined
  >();
  const [users, setUsers] = useState<[]>([]);
  const [zone, setZone] = useState<number | undefined>();

  console.log(zone)

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

  useEffect(() => {
    const audio = new Audio();

    if (zone === undefined)
      return;

    const tones = ["pink.mp3", "orange.mp3", "blue.mp3", "green.mp3"];

    audio.src = tones[zone];
    audio.play();
    audio.loop = true;

    return () => { audio.pause() }
  }
    , [zone])

  return (
    <>
      <section id="purple" onClick={() => setZone(0)}></section>
      <section id="orange" onClick={() => setZone(1)}></section>
      <section id="blue" onClick={() => setZone(2)}></section>
      <section id="green" onClick={() => setZone(3)}></section>
      <div id="me" className="online" style={getStyleByZone(zone)} />
      <button id="centre" onClick={() => setZone(undefined)}></button>
      <p style={{ display: "none" }} onClick={() => { setUsers([]) }}>{users.map(user => `${user}`)}</p>

    </>
  );
}

export default App;
