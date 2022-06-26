import './App.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrthographicCamera, useAspect } from '@react-three/drei'
import { useEffect } from 'react'

function getBoundingBox(scene) {
  const mesh = scene?.children?.find(child => child instanceof THREE.Mesh);
  const geometry = mesh?.geometry;
  geometry?.computeBoundingBox();
  const boundingBox = geometry?.boundingBox;
  return boundingBox;
}

function getCameraOptions({ boundingBox, canvasSize }) {
  const xmid = 0.5 * (boundingBox.min.x + boundingBox.max.x);
  const ymid = 0.5 * (boundingBox.min.y + boundingBox.max.y);
  const zCamera = 2 * boundingBox.max.z;
  const xRange = boundingBox.max.x - boundingBox.min.x
  const yRange = boundingBox.max.y - boundingBox.min.y
  const maxRange = Math.max(xRange, yRange)
  const canvasAspectRatio = canvasSize.width / canvasSize.height;
  const left = xmid - maxRange / 2 * canvasAspectRatio
  const right = xmid + maxRange / 2 * canvasAspectRatio
  const top = ymid + maxRange / 2
  const bottom = ymid - maxRange / 2
  const near = 0.1 * boundingBox.max.z
  const far = Math.max(1000, 10 * boundingBox.max.z);
  return {
    left,
    right,
    top,
    bottom,
    near,
    far,
    position: [xmid, ymid, zCamera],
  };
}

function getCamera({ scene, canvasSize }) {
  const boundingBox = getBoundingBox(scene);
  if (!boundingBox || boundingBox.isEmpty()) return new THREE.OrthographicCamera();
  const { left, right, top, bottom, near, far, position } = getCameraOptions({ boundingBox, canvasSize });
  const camera = new THREE.OrthographicCamera(
    left,
    right,
    top,
    bottom,
    near,
    far,
  );
  camera.position.set(...position);
  return camera;
}

function Camera() {
  const { scene, size: canvasSize } = useThree();
  const camera = getCamera({ scene, canvasSize });

  const set = useThree((state) => state.set)

  useEffect(() => {
    set({ camera })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far, camera.position.x, camera.position.y, camera.position.z]);
  return null;
}

function Mesh() {
  const cubeSize = 0.5;
  return (
    <mesh>
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshNormalMaterial />
    </mesh>
  );
}


function App() {
  const canvasSize = {
    width: document.innerWidth,
    height: window.innerHeight,
  };


  return (
    <div style={canvasSize}>
      <Canvas>
        {/*<OrthographicCamera makeDefault={true} {...cameraOptions} position={cameraPosition} />*/}
        <Mesh />
        <Camera />
      </Canvas>
    </div>
  );
}

export default App;
