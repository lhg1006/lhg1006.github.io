'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// 1. Gradient Blob
function GradientBlob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        color="#4f46e5"
        emissive="#7c3aed"
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.8}
        wireframe
      />
    </mesh>
  );
}

// 2. Particle Field
function ParticleField({ count = 2000 }) {
  const points = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#60a5fa"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// 3. Floating Shapes
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      rotation: Math.random() * Math.PI,
      scale: 0.2 + Math.random() * 0.4,
      speed: 0.2 + Math.random() * 0.3,
      type: Math.floor(Math.random() * 3),
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} index={i} />
      ))}
    </group>
  );
}

function FloatingShape({ position, scale, speed, type, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + index) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
    }
  });

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {type === 0 && <boxGeometry args={[1, 1, 1]} />}
      {type === 1 && <octahedronGeometry args={[0.7]} />}
      {type === 2 && <tetrahedronGeometry args={[0.8]} />}
      <meshStandardMaterial
        color={colors[index % 3]}
        emissive={colors[index % 3]}
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// 4. Wave Mesh
function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 0.5 + state.clock.elapsedTime) * 0.3 +
                  Math.sin(y * 0.5 + state.clock.elapsedTime * 0.8) * 0.3;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1, 0]}>
      <planeGeometry ref={geometryRef} args={[15, 15, 50, 50]} />
      <meshStandardMaterial
        color="#1e3a8a"
        emissive="#3b82f6"
        emissiveIntensity={0.2}
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// 5. Stars / Space
function Stars({ count = 3000 }) {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6 + Math.random() * 0.4);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

// 6. Minimal Lines
function MinimalLines() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const lines = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      return {
        start: [Math.cos(angle) * radius, -3, Math.sin(angle) * radius] as [number, number, number],
        end: [Math.cos(angle) * radius * 0.5, 3, Math.sin(angle) * radius * 0.5] as [number, number, number],
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([...line.start, ...line.end]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.4} />
        </line>
      ))}
      <mesh>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// 7. Matrix Code Rain - 개발자 스타일!
function MatrixRain({ count = 100 }) {
  const groupRef = useRef<THREE.Group>(null);

  const columns = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10 - 5,
      speed: 0.5 + Math.random() * 1.5,
      length: 3 + Math.random() * 5,
      offset: Math.random() * 10,
    }));
  }, [count]);

  return (
    <group ref={groupRef}>
      {columns.map((col, i) => (
        <MatrixColumn key={i} {...col} index={i} />
      ))}
      {/* 글로우 효과 */}
      <pointLight position={[0, 5, 0]} intensity={2} color="#00ff41" distance={20} />
      <pointLight position={[0, -5, 0]} intensity={1} color="#008f11" distance={15} />
    </group>
  );
}

function MatrixColumn({ x, z, speed, length, offset, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed + offset;
      meshRef.current.position.y = ((time % 10) - 5) * 2;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0, z]}>
      <boxGeometry args={[0.05, length, 0.05]} />
      <meshBasicMaterial color="#00ff41" transparent opacity={0.5} />
    </mesh>
  );
}

// 8. Network Nodes - 네트워크/회로 스타일
function NetworkNodes({ nodeCount = 50 }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
      ]);
    }
    return positions;
  }, [nodeCount]);

  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i][0] - nodes[j][0], 2) +
          Math.pow(nodes[i][1] - nodes[j][1], 2) +
          Math.pow(nodes[i][2] - nodes[j][2], 2)
        );
        if (dist < 4) {
          conns.push({ from: i, to: j });
        }
      }
    }
    return conns;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 노드들 */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#00d9ff' : i % 3 === 1 ? '#a855f7' : '#f472b6'} />
        </mesh>
      ))}
      {/* 연결선들 */}
      {connections.map((conn, i) => (
        <line key={`line-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([...nodes[conn.from], ...nodes[conn.to]]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00d9ff" transparent opacity={0.2} />
        </line>
      ))}
      {/* 글로우 */}
      <pointLight position={[0, 0, 5]} intensity={2} color="#00d9ff" distance={15} />
    </group>
  );
}

// 10. Aurora - 오로라 효과
function Aurora() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#00ff87') },
    uColor2: { value: new THREE.Color('#60efff') },
    uColor3: { value: new THREE.Color('#a855f7') },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[15, 10, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying vec2 vUv;

          void main() {
            float wave1 = sin(vUv.x * 3.0 + uTime) * 0.5 + 0.5;
            float wave2 = sin(vUv.x * 5.0 - uTime * 1.3) * 0.5 + 0.5;
            float wave3 = sin(vUv.x * 2.0 + uTime * 0.7) * 0.5 + 0.5;

            float mask = smoothstep(0.3, 0.7, vUv.y + wave1 * 0.2 - 0.1);
            mask *= smoothstep(0.9, 0.5, vUv.y + wave2 * 0.15);

            vec3 color = mix(uColor1, uColor2, wave1);
            color = mix(color, uColor3, wave3 * 0.5);

            float alpha = mask * (0.3 + wave2 * 0.2);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 11. Orbs - 부드러운 글로우 오브
function GlowOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.4,
      color: ['#60efff', '#00ff87', '#a855f7', '#ff6b6b', '#ffd93d'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function GlowOrb({ position, scale, speed, color, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + index * 2;
      meshRef.current.position.x = position[0] + Math.sin(t) * 1.5;
      meshRef.current.position.y = position[1] + Math.cos(t * 0.7) * 1;
      meshRef.current.position.z = position[2] + Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

// 12. Fluid - 유체 느낌 웨이브
function FluidWaves() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z =
          Math.sin(x * 0.3 + time * 0.5) * 0.8 +
          Math.sin(y * 0.4 + time * 0.3) * 0.6 +
          Math.sin((x + y) * 0.2 + time * 0.4) * 0.5;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -3]}>
        <planeGeometry ref={geometryRef} args={[25, 20, 80, 80]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#4f46e5"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
      <pointLight position={[0, 5, 5]} intensity={2} color="#60efff" />
      <pointLight position={[-5, 3, 0]} intensity={1.5} color="#a855f7" />
    </>
  );
}

// 13. DNA Helix - DNA 이중나선
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereCount = 40;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const spheres = useMemo(() => {
    return Array.from({ length: sphereCount }, (_, i) => {
      const t = (i / sphereCount) * Math.PI * 4;
      const y = (i / sphereCount) * 10 - 5;
      return {
        pos1: [Math.cos(t) * 2, y, Math.sin(t) * 2] as [number, number, number],
        pos2: [Math.cos(t + Math.PI) * 2, y, Math.sin(t + Math.PI) * 2] as [number, number, number],
        color1: `hsl(${180 + i * 3}, 80%, 60%)`,
        color2: `hsl(${280 + i * 3}, 80%, 60%)`,
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <group key={i}>
          <mesh position={s.pos1}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color={s.color1} />
          </mesh>
          <mesh position={s.pos2}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color={s.color2} />
          </mesh>
          {i % 4 === 0 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...s.pos1, ...s.pos2]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </line>
          )}
        </group>
      ))}
      <pointLight position={[0, 0, 5]} intensity={2} color="#60efff" />
    </group>
  );
}

// 15. Minimal Gradient - 미니멀 그라데이션 (모던/세련됨)
function MinimalGradient() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={[20, 15, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            // 부드러운 그라데이션 움직임
            float noise1 = sin(uv.x * 2.0 + uTime) * cos(uv.y * 2.0 + uTime * 0.7);
            float noise2 = sin(uv.y * 3.0 - uTime * 0.5) * cos(uv.x * 1.5 + uTime * 0.3);

            // 다크 블루/퍼플 그라데이션
            vec3 color1 = vec3(0.02, 0.02, 0.08); // 거의 검정
            vec3 color2 = vec3(0.05, 0.02, 0.15); // 다크 퍼플
            vec3 color3 = vec3(0.02, 0.05, 0.12); // 다크 블루

            float blend = smoothstep(0.0, 1.0, uv.y + noise1 * 0.1);
            float blend2 = smoothstep(0.0, 1.0, uv.x + noise2 * 0.1);

            vec3 finalColor = mix(color1, color2, blend);
            finalColor = mix(finalColor, color3, blend2 * 0.5);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// 16. Soft Particles - 부드러운 파티클 (애플 스타일)
function SoftParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 100;

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    return [positions, sizes];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      const posArray = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// 18. Bold Neon - 크고 화려한 네온
function BoldNeon() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 큰 네온 링들 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.08, 16, 100]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.5, 0]}>
        <torusGeometry args={[5, 0.06, 16, 100]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 3, -0.3, 0.2]}>
        <torusGeometry args={[6, 0.04, 16, 100]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.7} />
      </mesh>

      {/* 중앙 글로우 구체 */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
      </mesh>

      {/* 강한 조명 */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#00ffff" distance={20} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ff00ff" distance={15} />
      <pointLight position={[-5, -5, 5]} intensity={2} color="#ffff00" distance={15} />
    </group>
  );
}

// 19. Plasma - 플라즈마 효과
function Plasma() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={[18, 12, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv * 3.0 - 1.5;

            float v1 = sin(uv.x * 5.0 + uTime);
            float v2 = sin(5.0 * (uv.x * sin(uTime * 0.5) + uv.y * cos(uTime * 0.3)) + uTime);
            float v3 = sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 4.0 + uTime);
            float v = (v1 + v2 + v3) / 3.0;

            vec3 col1 = vec3(0.0, 1.0, 1.0);  // cyan
            vec3 col2 = vec3(1.0, 0.0, 1.0);  // magenta
            vec3 col3 = vec3(1.0, 1.0, 0.0);  // yellow

            vec3 color = mix(col1, col2, sin(v * 3.14159) * 0.5 + 0.5);
            color = mix(color, col3, sin(v * 3.14159 + 2.0) * 0.5 + 0.5);

            gl_FragColor = vec4(color * 0.6, 0.8);
          }
        `}
        transparent
      />
    </mesh>
  );
}

// 21. Clean Modern - Apple/Vercel 스타일
function CleanModern() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <>
      {/* 배경 그라데이션 */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      <group ref={groupRef} position={[3, 0, -2]}>
        {/* 메인 글로우 구체 */}
        <mesh ref={sphereRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#4338ca"
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* 은은한 링 */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[3.5, 0.01, 16, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* 왼쪽 작은 구체 */}
      <mesh position={[-4, 2, -3]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 은은한 조명 */}
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#8b5cf6" />
    </>
  );
}

// 23. Light Mode - 밝은 배경용 (가독성 향상)
function LightBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const sphere1Ref = useRef<THREE.Mesh>(null);
  const sphere2Ref = useRef<THREE.Mesh>(null);
  const sphere3Ref = useRef<THREE.Mesh>(null);
  const sphere4Ref = useRef<THREE.Mesh>(null);
  const sphere5Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
    }

    // 각 구체가 독립적으로 움직임
    if (sphere1Ref.current) {
      sphere1Ref.current.position.x = 8 + Math.sin(t * 0.5) * 2;
      sphere1Ref.current.position.y = 3 + Math.cos(t * 0.4) * 1.5;
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.x = -7 + Math.cos(t * 0.4) * 2;
      sphere2Ref.current.position.y = -2 + Math.sin(t * 0.5) * 1.5;
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.position.x = 0 + Math.sin(t * 0.3) * 1.5;
      sphere3Ref.current.position.y = 6 + Math.cos(t * 0.35) * 1;
    }
    if (sphere4Ref.current) {
      sphere4Ref.current.position.x = -10 + Math.sin(t * 0.45) * 1.5;
      sphere4Ref.current.position.y = 4 + Math.cos(t * 0.5) * 1;
    }
    if (sphere5Ref.current) {
      sphere5Ref.current.position.x = 10 + Math.cos(t * 0.35) * 2;
      sphere5Ref.current.position.y = -4 + Math.sin(t * 0.4) * 1.5;
    }
  });

  return (
    <>
      {/* 밝은 배경 */}
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <group ref={groupRef}>
        {/* 컬러풀한 그라데이션 구체들 - 더 넓게 퍼짐 */}
        <mesh ref={sphere1Ref} position={[8, 3, -6]}>
          <sphereGeometry args={[4.5, 64, 64]} />
          <meshBasicMaterial color="#c7d2fe" transparent opacity={0.55} />
        </mesh>
        <mesh ref={sphere2Ref} position={[-7, -2, -7]}>
          <sphereGeometry args={[4, 64, 64]} />
          <meshBasicMaterial color="#fbcfe8" transparent opacity={0.5} />
        </mesh>
        <mesh ref={sphere3Ref} position={[0, 6, -8]}>
          <sphereGeometry args={[3.5, 64, 64]} />
          <meshBasicMaterial color="#a7f3d0" transparent opacity={0.45} />
        </mesh>
        <mesh ref={sphere4Ref} position={[-10, 4, -5]}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshBasicMaterial color="#fde68a" transparent opacity={0.5} />
        </mesh>
        <mesh ref={sphere5Ref} position={[10, -4, -6]}>
          <sphereGeometry args={[3.5, 64, 64]} />
          <meshBasicMaterial color="#bfdbfe" transparent opacity={0.5} />
        </mesh>
      </group>
    </>
  );
}

// 24. Blue Theme - GitHub 페이지 스타일 (블루-시안)
function BlueThemeBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      // 블루-시안 컬러 팔레트
      const hue = 0.5 + Math.random() * 0.1; // 파란색~시안
      const color = new THREE.Color();
      color.setHSL(hue, 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      {/* 밝은 배경 */}
      <mesh position={[0, 0, -15]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial color="#f5f5f5" />
      </mesh>

      <group ref={groupRef}>
        {/* 블루 그라데이션 구체들 */}
        <mesh position={[6, 2, -8]}>
          <sphereGeometry args={[4, 64, 64]} />
          <meshBasicMaterial color="#bbdefb" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-5, -1, -9]}>
          <sphereGeometry args={[3.5, 64, 64]} />
          <meshBasicMaterial color="#b2ebf2" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0, 4, -10]}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshBasicMaterial color="#c5cae9" transparent opacity={0.4} />
        </mesh>
        <mesh position={[-7, 3, -7]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshBasicMaterial color="#80deea" transparent opacity={0.45} />
        </mesh>
        <mesh position={[7, -3, -8]}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshBasicMaterial color="#90caf9" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 부드러운 파티클 */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// 22. Gradient Orb - 그라데이션 오브 (Stripe 스타일)
function GradientOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.2;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      <mesh ref={meshRef} position={[2, 0, -3]} scale={4}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vPosition;

            void main() {
              vec3 color1 = vec3(0.4, 0.2, 0.8);  // purple
              vec3 color2 = vec3(0.2, 0.4, 0.9);  // blue
              vec3 color3 = vec3(0.1, 0.8, 0.6);  // teal

              float noise = sin(vPosition.x * 3.0 + uTime) * sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5;
              float noise2 = sin(vPosition.z * 2.0 - uTime * 0.5) * 0.5 + 0.5;

              vec3 color = mix(color1, color2, noise);
              color = mix(color, color3, noise2 * 0.5);

              float fresnel = pow(1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0))), 2.0);
              color += fresnel * 0.3;

              gl_FragColor = vec4(color, 0.9);
            }
          `}
          transparent
        />
      </mesh>

      <pointLight position={[5, 5, 5]} intensity={0.3} color="#8b5cf6" />
    </>
  );
}

// 20. Galaxy - 은하수 스타일
function Galaxy() {
  const points = useRef<THREE.Points>(null);
  const count = 5000;

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 8 + 1;
      const spinAngle = radius * 2;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const randomX = (Math.random() - 0.5) * 2 * (1 - radius / 10);
      const randomY = (Math.random() - 0.5) * 0.5;
      const randomZ = (Math.random() - 0.5) * 2 * (1 - radius / 10);

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const color = new THREE.Color();
      const mixRatio = radius / 10;
      color.setHSL(0.6 - mixRatio * 0.3, 1, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.1 + 0.02;
    }
    return [positions, colors, sizes];
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* 중앙 빛 */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffd700" distance={10} />
    </group>
  );
}

// 17. Modern Abstract - 모던 추상 (Vercel/Linear 스타일)
function ModernAbstract() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* 글로우 링 */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.3]}>
          <torusGeometry args={[3 + i * 1.5, 0.01, 16, 100]} />
          <meshBasicMaterial
            color={i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#ec4899'}
            transparent
            opacity={0.3 - i * 0.08}
          />
        </mesh>
      ))}

      {/* 중앙 글로우 */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>

      {/* 은은한 조명 */}
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#3b82f6" />
    </group>
  );
}

// 14. Geometric - 기하학적 패턴
function GeometricPattern() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: 1 + i * 0.8,
      rotation: i * 0.5,
      speed: 0.2 + i * 0.05,
      color: ['#60efff', '#00ff87', '#a855f7', '#ff6b6b', '#ffd93d'][i],
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z = state.clock.elapsedTime * rings[i % rings.length].speed * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, ring.rotation]}>
          <torusGeometry args={[ring.radius, 0.02, 16, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* 중앙 구체 */}
      <mesh>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
      </mesh>
      <pointLight position={[0, 0, 3]} intensity={2} color="#60efff" />
    </group>
  );
}

// 9. Cyber Grid - 네온 그리드 + 파티클
function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.3, 1, 0.5 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += 0.02;
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={gridRef}>
      {/* 바닥 그리드 */}
      <gridHelper args={[30, 30, '#0ea5e9', '#0c4a6e']} position={[0, -3, 0]} />

      {/* 수직 그리드 라인 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[(i - 5) * 3, 2, -10]}>
          <boxGeometry args={[0.02, 10, 0.02]} />
          <meshBasicMaterial color="#0ea5e9" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* 상승하는 파티클 */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* 글로우 조명 */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#0ea5e9" distance={20} />
      <pointLight position={[5, 5, -5]} intensity={2} color="#a855f7" distance={15} />
      <pointLight position={[-5, 3, -5]} intensity={2} color="#f472b6" distance={15} />
    </group>
  );
}

// Scene Wrapper
type BackgroundType = 'blob' | 'particles' | 'shapes' | 'wave' | 'stars' | 'lines' | 'matrix' | 'network' | 'cyber' | 'aurora' | 'orbs' | 'fluid' | 'dna' | 'geometric' | 'minimal' | 'soft' | 'modern' | 'neon' | 'plasma' | 'galaxy' | 'clean' | 'stripe' | 'light' | 'blue';

interface Background3DProps {
  type?: BackgroundType;
  className?: string;
}

export default function Background3D({ type = 'particles', className }: Background3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />

        {type === 'blob' && <GradientBlob />}
        {type === 'particles' && <ParticleField />}
        {type === 'shapes' && <FloatingShapes />}
        {type === 'wave' && <WaveMesh />}
        {type === 'stars' && <Stars />}
        {type === 'lines' && <MinimalLines />}
        {type === 'matrix' && <MatrixRain />}
        {type === 'network' && <NetworkNodes />}
        {type === 'cyber' && <CyberGrid />}
        {type === 'aurora' && <Aurora />}
        {type === 'orbs' && <GlowOrbs />}
        {type === 'fluid' && <FluidWaves />}
        {type === 'dna' && <DNAHelix />}
        {type === 'geometric' && <GeometricPattern />}
        {type === 'minimal' && <><MinimalGradient /><SoftParticles /></>}
        {type === 'soft' && <SoftParticles />}
        {type === 'modern' && <><MinimalGradient /><ModernAbstract /></>}
        {type === 'neon' && <BoldNeon />}
        {type === 'plasma' && <Plasma />}
        {type === 'galaxy' && <Galaxy />}
        {type === 'clean' && <CleanModern />}
        {type === 'stripe' && <GradientOrb />}
        {type === 'light' && <LightBackground />}
        {type === 'blue' && <BlueThemeBackground />}
      </Canvas>
    </div>
  );
}
