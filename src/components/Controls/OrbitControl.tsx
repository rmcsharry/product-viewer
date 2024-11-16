import { Component } from 'solid-js';

interface OrbitControlProps {
  onRotationChange: (rotation: { x: number; y: number }) => void;
}

const OrbitControl: Component<OrbitControlProps> = (props) => {
  let isDragging = false;
  let startPos = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };

  const handleMouseDown = (e: MouseEvent) => {
    isDragging = true;
    startPos = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    currentRotation = {
      x: currentRotation.x + deltaY * 0.01,
      y: currentRotation.y + deltaX * 0.01
    };
    
    props.onRotationChange(currentRotation);
    startPos = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  return (
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Rotation Control</h3>
      <div
        class="orbit-control mx-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          class="absolute w-4 h-4 bg-blue-500 rounded-full"
          style={{
            left: `${50 + Math.sin(currentRotation.y) * 40}%`,
            top: `${50 + Math.sin(currentRotation.x) * 40}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
};

export default OrbitControl;