import React from "react";
import { store } from "../../store.js";

const Canvas = props => {
  props.socket.on("draw", data => {
    setData(data);
  });

  const canvasRef = React.useRef(null);
  const [drawing, setDrawing] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [line, setLine] = React.useState([]);
  const { state } = React.useContext(store);

  const draw = (ctx, x0, y0, x1, y1, colorParam, thicknessParam) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineCap = "round";
    ctx.strokeStyle = colorParam;
    ctx.lineWidth = thicknessParam;
    ctx.stroke();
    ctx.closePath();
  };

  const reset = () => {
    if (!drawing) return;

    const storage = JSON.parse(localStorage.getItem("drawing"));
    // console.log(storage?.lines);
    if (storage) {
      localStorage.setItem(
        "drawing",
        JSON.stringify({
          lines: [...storage.lines, line],
          width: window.innerWidth,
          height: window.innerHeight
        })
      );
    } else {
      localStorage.setItem(
        "drawing",
        JSON.stringify({
          lines: [line],
          width: window.innerWidth,
          height: window.innerHeight
        })
      );
    }

    setPos(null);
    setLine([]);
    setDrawing(false);
  };

  // const load = () => {
  //   const lines = JSON.parse(localStorage.getItem("drawing")).lines;
  //   console.log(lines);
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   for (let i = 0; i < lines.length - 1; i++) {
  //     for (let j = 0; j < lines.length - 2; j++) {
  // draw(
  //   ctx,
  //   lines[i][j].x,
  //   lines[i][j].y,
  //   lines[i][j + 1].x,
  //   lines[i][j + 1].y
  // );
  //     }
  //   }
  // };

  // const clear = () => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   localStorage.clear();
  // };

  React.useEffect(() => {
    if (!data) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(
      ctx,
      data.x0 * window.innerWidth,
      data.y0 * window.innerHeight,
      data.x1 * window.innerWidth,
      data.y1 * window.innerHeight,
      data.color,
      data.thickness
    );
  }, [data]);

  return (
    <div className="canvasCont">
      {/* these buttons really screw up the alignment of the cursor and drawing */}
      {/* <button onClick={load}>Load</button>
      <button onClick={clear}>Clear</button> */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={e => {
          setPos({ x: e.clientX, y: e.clientY });
          setDrawing(true);
        }}
        onMouseUp={reset}
        onMouseOut={reset}
        onMouseMove={e => {
          if (!drawing) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          // needed if there is a misalignment
          // const rect = canvas.getBoundingClientRect();
          setPos({ x: e.clientX, y: e.clientY });
          setLine(line => [...line, pos]);
          props.socket.emit("draw", {
            room: state.room,
            data: {
              x0: pos.x / window.innerWidth,
              y0: pos.y / window.innerHeight,
              x1: e.clientX / window.innerWidth,
              y1: e.clientY / window.innerHeight,
              color: state.color,
              thickness: state.thickness
            }
          });
          draw(
            ctx,
            pos.x,
            pos.y,
            e.clientX,
            e.clientY,
            state.color,
            state.thickness
          );
        }}
      />
    </div>
  );
};

export default Canvas;
