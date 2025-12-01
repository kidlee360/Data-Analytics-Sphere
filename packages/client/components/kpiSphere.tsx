// client/components/KpiSphere.tsx (Create this file)
"use client"; // <-- ADD THIS LINE
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // <-- Import the hook
import { useRouter } from 'next/navigation';

// This retrieves the variable set in .env.local or your hosting platform
const API_URL = process.env.NEXT_PUBLIC_API_URL; 




// 3D Mesh Component
const DynamicSphere: React.FC<{ kpiScore: number }> = ({ kpiScore }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Dynamic properties based on KPI score (e.g., Green/High score, Red/Low score)
  const color = kpiScore > 4.0 ? '#00FF00' : (kpiScore > 3.0 ? '#FFD700' : '#FF0000');
  const scaleFactor = 1 + kpiScore / 10; // Sphere size changes with score

  // Animate the sphere on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
      // Animate the scale slightly for a "breathing" effect
      meshRef.current.scale.setScalar(scaleFactor + Math.sin(state.clock.elapsedTime) * 0.05);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} scale={scaleFactor}>
      <MeshDistortMaterial
        color={color}
        distort={kpiScore / 5} // Distortion level based on KPI score
        speed={2}
        roughness={0.5}
      />
    </Sphere>
  );
};

// Main R3F Widget
const KpiSphereWidget = () => {
  const [kpi, setKpi] = useState(0.00);
  const router = useRouter();

  useEffect(() => {
    const storedAuthData = localStorage.getItem('authData');
    if (!storedAuthData) {
      router.push('/auth/login');
      return;
    }
    const { token } = JSON.parse(storedAuthData);
    const fetchKpi = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/kpi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKpi(parseFloat(response.data.kpi_score)); // Parse the string into a float
      } catch (error) {
        console.error("Failed to fetch KPI:", error);
      }
    };
    fetchKpi();
  }, []);

  return (
    <div style={{ height: '200px', width: '200px', margin: '20px auto' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <DynamicSphere kpiScore={kpi} />
      </Canvas>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '1.2em' }}>
        Current KPI: **{kpi.toFixed(2)}**
      </div>
    </div>
  );
};

export default KpiSphereWidget;