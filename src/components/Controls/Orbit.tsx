import { Component, createSignal } from 'solid-js';

interface OrbitProps {
  onRotationChange: (rotation: { x: number; y: number }) => void;
}

const Orbit: Component<OrbitProps> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [startPos, setStartPos] = createSignal({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = createSignal({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return;
    
    const deltaX = e.clientX - startPos().x;
    const deltaY = e.clientY - startPos().y;
    
    const newRotation = {
      x: currentRotation().x + deltaY * 0.01,
      y: currentRotation().y + deltaX * 0.01
    };
    
    setCurrentRotation(newRotation);
    props.onRotationChange(newRotation);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
            left: `${50 + Math.sin(currentRotation().y) * 40}%`,
            top: `${50 + Math.sin(currentRotation().x) * 40}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
};

export default Orbit;