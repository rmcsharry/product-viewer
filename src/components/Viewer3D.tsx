import { onMount, onCleanup, createEffect } from 'solid-js';
import { SceneSetup } from './Scene/SceneSetup';

interface Viewer3DProps {
  zoom: number;
  rotation: { x: number; y: number };
  onZoomChange?: (zoom: number) => void;
}

export default function Viewer3D(props: Viewer3DProps) {
  let containerRef: HTMLDivElement | undefined;
  let sceneSetup: SceneSetup;

  const init = () => {
    sceneSetup = new SceneSetup(containerRef!);
    sceneSetup.onZoomChange = props.onZoomChange;

    const animate = () => {
      requestAnimationFrame(animate);
      sceneSetup.render();
    };
    animate();

    const handleResize = () => {
      sceneSetup.resize(containerRef!.clientWidth, containerRef!.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      sceneSetup.dispose();
    };
  };

  onMount(() => {
    const cleanup = init();
    onCleanup(cleanup);
  });

  // Watch for zoom changes
  createEffect(() => {
    if (sceneSetup) {
      sceneSetup.updateZoom(props.zoom);
    }
  });

  // Watch for rotation changes
  createEffect(() => {
    if (sceneSetup) {
      sceneSetup.updateRotation(props.rotation);
    }
  });

  return <div ref={containerRef} class="w-full h-full" />;
}