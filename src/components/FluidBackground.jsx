import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FluidShader = {
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uColor1: { value: new THREE.Color('#0f0f0f') }, // Matte Black
        uColor2: { value: new THREE.Color('#1a1a1a') }, // Dark Gray
        uAccent: { value: new THREE.Color('#ffffff') }, // Neon White
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uAccent;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Aspect ratio correction
      float aspect = uResolution.x / uResolution.y;
      vec2 aspectUV = uv;
      aspectUV.x *= aspect;
      
      // Mouse influence
      vec2 mouse = uMouse;
      mouse.x *= aspect;
      
      float dist = distance(aspectUV, mouse);
      float mouseInteraction = smoothstep(0.5, 0.0, dist);
      
      // Fluid distortion
      float noise1 = snoise(uv * 3.0 + uTime * 0.1);
      float noise2 = snoise(uv * 10.0 - uTime * 0.2 + mouseInteraction * 2.0);
      
      vec2 distortedUV = uv + vec2(noise1 * 0.05, noise2 * 0.05);
      
      // Color mixing
      float mixFactor = snoise(distortedUV * 2.0 + uTime * 0.05);
      mixFactor = smoothstep(-0.5, 0.5, mixFactor);
      
      vec3 color = mix(uColor1, uColor2, mixFactor);
      
      // Add "refraction" / highlight
      float highlight = smoothstep(0.4, 0.42, noise2) - smoothstep(0.42, 0.45, noise2);
      color += uAccent * highlight * 0.1;
      
      // Mouse trail glow
      color += uAccent * mouseInteraction * 0.05;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const FluidPlane = () => {
    const mesh = useRef();
    const { size, viewport } = useThree();
    const mouse = useRef(new THREE.Vector2(0, 0));

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uColor1: { value: new THREE.Color('#0f0f0f') },
            uColor2: { value: new THREE.Color('#1a1a1a') },
            uAccent: { value: new THREE.Color('#ffffff') },
        }),
        []
    );

    useFrame((state) => {
        const { clock, pointer } = state;
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();

            // Smooth mouse movement
            mouse.current.lerp(pointer, 0.1);

            // Map pointer (-1 to 1) to UV space (0 to 1)
            const uvMouse = new THREE.Vector2(
                (mouse.current.x + 1) / 2,
                (mouse.current.y + 1) / 2
            );

            mesh.current.material.uniforms.uMouse.value = uvMouse;
            mesh.current.material.uniforms.uResolution.value.set(size.width, size.height);
        }
    });

    return (
        <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={FluidShader.vertexShader}
                fragmentShader={FluidShader.fragmentShader}
            />
        </mesh>
    );
};

const FluidBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-matte-black">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <FluidPlane />
            </Canvas>
        </div>
    );
};

export default FluidBackground;
