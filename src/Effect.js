import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
// import { GlitchPass } from './GlitchPass'

extend({ EffectComposer, RenderPass, UnrealBloomPass, FilmPass })

const Effect = ({grayScale}) => {
  const composer = useRef()
  const [glitch, setGlitch] = useState(false);
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(512, 512), [])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* <unrealBloomPass attachArray="passes" args={[aspect, 0.1, 0.1, 0.3]} /> */}
      <filmPass attachArray="passes" args={[0.1, 0.1, 1000, 0]} />
    </effectComposer>
  )
}

export default Effect;