import React from "react";
import axios from "axios";
import { socketInst } from "../../socket.js";
import { store } from "../../store.js";
import useMountEffect from "../../hooks/useMountEffect.js";
import Canvas from "../Canvas/Canvas.js";
import Toolbar from "../Toolbar/Toolbar.js";
import "./Container.scss";

const Container = props => {
  const socket = React.useContext(socketInst);
  const { state, dispatch } = React.useContext(store);

  const [clear, setClear] = React.useState(false);
  const [download, setDownload] = React.useState(false);
  const [prevLines, setPrevLines] = React.useState([]);
  const [room, setRoom] = React.useState([]);

  // need functions here that help with drawing, clearing, undoing, etc.
  const clearCanvas = bool => {
    setClear(bool);
  };

  const handleDownload = bool => {
    setDownload(bool);
  };

  const getRoom = reqRoom => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/room?room=${reqRoom}`,
      withCredentials: true
    }).then(res => setRoom(res.data));
  };

  const draw = (ctx, x0, y0, x1, y1, color, thickness) => {
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    // draw line
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
  };

  const saveLine = line => {
    axios({
      method: "post",
      url: "http://localhost:8000/api/line",
      data: {
        id: state.id,
        name: state.name,
        room: state.room,
        line: { color: state.color, thickness: state.thickness, points: line }
      },
      withCredentials: true
    });
  };

  const getPrevLines = room => {
    axios({
      method: "get",
      url: `http://localhost:8000/api/line?room=${room}`,
      withCredentials: true
    }).then(res => {
      setPrevLines(res.data);
    });
  };

  useMountEffect(() => {
    if (state.room) {
      socket.emit("join", state);
      getRoom(state.room);
      getPrevLines(state.room); // get previous lines in the room
      return;
    }

    let newRoom;
    axios({
      method: "get",
      url: "http://localhost:8000/api/user",
      withCredentials: true
    }).then(res => {
      dispatch({ type: "all", payload: res.data }); // set global state
      socket.emit("join", res.data); // emit to room of a new user
      getPrevLines(res.data.room); // get previous lines in the room
      getRoom(res.data.room); // finds users in room
    });
  });

  return (
    <section className="container">
      <Toolbar
        clearCanvas={clearCanvas}
        handleDownload={handleDownload}
        room={room}
        setRoom={setRoom}
        getRoom={getRoom}
      />
      <Canvas
        draw={draw}
        clear={clear}
        clearCanvas={clearCanvas}
        download={download}
        handleDownload={handleDownload}
        saveLine={saveLine}
        prevLines={prevLines}
      />
    </section>
  );
};

export default Container;
