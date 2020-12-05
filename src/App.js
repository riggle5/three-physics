import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon';
import lerp from './utils/lerp';

const Plane = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1200, 1200]} />
      <meshPhongMaterial attach="material" color="plum" />
    </mesh>
  );
};

const Sphere = (props) => {
  const [ref, api] = useSphere(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  let values = useRef([0, 0]);
  useFrame((state) => {
    values.current[0] = lerp(values.current[0], (state.mouse.x * Math.PI) / 5, 10);
    values.current[1] = lerp(values.current[1], (state.mouse.x * Math.PI) / 5, 10);
    api.position.set(state.mouse.x * 10, 0, state.mouse.y * -10);
  });

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry attach="geometry" />
      <meshToonMaterial color="lightgreen" />
    </mesh>
  );
};

const Geometory = (props) => {
  const [ref] = useBox(() => ({ mass: 1, args: [0.1, 3.1, 3.1], rotation: [0, 0, 0], ...props }));
  const gltf = useLoader(GLTFLoader, props.emoji);
  const [geometry, setGeometry] = useState();
  // https://github.com/pmndrs/react-three-fiber/issues/245 GLTFの複数配置
  if (!geometry) {
    const scene = gltf.scene.clone(true);
    setGeometry(scene);
  }

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <primitive castShadow object={geometry} dispose={null} args={[2, 2, 2]} />
    </mesh>
  );
};

const App = () => {
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  return (
    <Canvas
      shadowMap
      sRGB
      gl={{ alpha: false }}
      camera={{ position: [0, 12, 10], rotation: [0, 0, 0], fov: 90 }}
      style={{ height: '100vh', width: '100vw' }}
      onMouseMove={onMouseMove}
    >
      <color attach="background" args={['plum']} />
      <hemisphereLight intensity={0.35} />
      <spotLight
        position={[30, 0, 30]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
      />
      <Physics>
        <Plane mouse={mouse} />
        <Geometory position={[0, 4, 0]} emoji="/emoji_think.glb" />
        <Geometory position={[1, 4, 0]} emoji="/emoji_laugh.glb" />
        <Geometory position={[2, 4, 0]} emoji="/emoji_pien.glb" />
        <Geometory position={[3, 1, 0]} emoji="/emoji_think.glb" />
        <Geometory position={[5, 4, 0]} emoji="/emoji_laugh.glb" />
        <Geometory position={[0, 1, 3]} emoji="/emoji_pien.glb" />
        <Geometory position={[0, 4, 0]} emoji="/emoji_think.glb" />
        <Geometory position={[0, 2, 3]} emoji="/emoji_laugh.glb" />
        <Geometory position={[2, 4, 4]} emoji="/emoji_pien.glb" />
        <Geometory position={[0, 4, 0]} emoji="/emoji_think.glb" />
        <Geometory position={[0, 2, 3]} emoji="/emoji_laugh.glb" />
        <Geometory position={[5, 4, 4]} emoji="/emoji_pien.glb" />
        <Geometory position={[2, 4, 6]} emoji="/emoji_think.glb" />
        <Geometory position={[3, 2, 5]} emoji="/emoji_laugh.glb" />
        <Geometory position={[1, 4, 7]} emoji="/emoji_pien.glb" />
        <Sphere />
      </Physics>
    </Canvas>
  );
};

export default App;
