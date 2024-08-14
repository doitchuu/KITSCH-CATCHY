import { useState, useEffect, useCallback } from "react";
import TIME from "../constants/timeConstants";
import SIZE from "../constants/sizeConstants";

function useDragAndResize({
  position: initialPosition,
  size: initialSize,
  aspectRatio,
  onDragEnd,
  onResize,
  id,
}) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [size, setSize] = useState(initialSize);

  const handleMouseMove = useCallback(
    (event) => {
      if (dragging) {
        setPosition((prev) => ({
          x: prev.x + event.movementX * TIME.MOVE_SPEED,
          y: prev.y + event.movementY * TIME.MOVE_SPEED,
        }));

        return;
      }

      if (resizing) {
        const newWidth = Math.max(
          size.width + event.movementX * TIME.MOVE_SPEED,
          SIZE.MIN_IMAGE_SIZE,
        );
        const newHeight = newWidth / aspectRatio;

        setSize({
          width: newWidth,
          height: newHeight,
        });
      }
    },
    [dragging, resizing, size, aspectRatio],
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      onDragEnd(id, { ...position });
      setDragging(false);
    }

    if (resizing) {
      onResize(id, { ...size });
      setResizing(false);
    }

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [
    dragging,
    resizing,
    position,
    size,
    onDragEnd,
    onResize,
    id,
    handleMouseMove,
  ]);

  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, handleMouseMove, handleMouseUp]);

  return { position, size, setDragging, setResizing };
}

export default useDragAndResize;
