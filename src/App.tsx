import { createSignal } from 'solid-js';
import Viewer3D from './components/Viewer3D';

function App() {
  const [zoom, setZoom] = createSignal(5);
  const [rotation] = createSignal({ x: 0, y: 0 });

  return (
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">Cherny 3D Model Viewer</h1>
        
        <div class="grid grid-cols-[1fr,auto,auto] gap-8">
          <div class="bg-white rounded-lg shadow-lg" style="height: 600px">
            <Viewer3D 
              zoom={zoom()} 
              rotation={rotation()} 
              onZoomChange={setZoom}
            />
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <h1>Maybe options area</h1>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <h1>Maybe tools/controls area</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;