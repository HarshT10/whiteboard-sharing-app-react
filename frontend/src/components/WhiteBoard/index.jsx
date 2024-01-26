import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";
import "./index.css";

/* eslint-disable react/prop-types */

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  user,
  socket,
}) => {
  const [image, setImage] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImage(data.imageURL);
    });
  }, []);

  if (!user?.presenter) {
    return (
      <div className="bg-white h-100 w-100 canvas-box overflow-hidden">
        <img
          src={image}
          alt="Real Time White Board Image Shared by Presenter"
          style={{
            height: window.innerHeight * 2,
            // width: "285%",
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, [canvasRef]);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  useLayoutEffect(() => {
    if (canvasRef) {
      const roughCanvas = rough.canvas(canvasRef.current);

      if (elements.length > 0) {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }

      elements.forEach((element) => {
        if (element.type === "rectangle") {
          roughCanvas.draw(
            roughGenerator.rectangle(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              {
                stroke: element.stroke,
                strokeWidth: 5,
                roughness: 0,
              }
            )
          );
        } else if (element.type === "line") {
          roughCanvas.draw(
            roughGenerator.line(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              {
                stroke: element.stroke,
                strokeWidth: 5,
                roughness: 0,
              }
            )
          );
        } else if (element.type === "pencil") {
          roughCanvas.linearPath(element.path, {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          });
        }
      });

      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteBoardData", canvasImage);
    }
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          heightL: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rectangle") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((element, index) =>
            index === elements.length - 1
              ? { ...element, path: newPath }
              : element
          )
        );
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((e, index) => {
            if (index === elements.length - 1) {
              return {
                ...e,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return e;
            }
          })
        );
      } else if (tool === "rectangle") {
        setElements((prevElements) =>
          prevElements.map((e, index) => {
            if (index === elements.length - 1) {
              return {
                ...e,
                width: offsetX - e.offsetX,
                height: offsetY - e.offsetY,
              };
            } else {
              return e;
            }
          })
        );
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-white h-100 w-100 canvas-box overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;
