// client/components/ChartCard.tsx (Create this file)
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  data: any[];
  title: string;
  delayIndex: number; // New prop to control delay
}

const ChartCard: React.FC<ChartCardProps> = ({ data, title, delayIndex }) => {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // 1. Create a Master Timeline for the card entry
    const tl = gsap.timeline({ delay: delayIndex * 0.2 });

    // 2. Animate the Card Container (staggered entry)
    tl.from(containerRef.current, { 
      y: 50, 
      duration: 1.2, 
      ease: "power3.out"
    });

    // 3. Animate the Chart Lines/Paths
    // Recharts uses SVG elements. We target the SVG path elements with the class 'recharts-line'
    tl.from('.recharts-line-curve', { 
        // This animates the stroke-dashoffset, creating the "drawing" effect
        strokeDashoffset: (i, target) => target.getTotalLength(),
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.5 // If there are multiple lines, stagger their drawing
    }, '-=0.8'); // Start the line animation 0.8 seconds before the card entry is finished

  }, { scope: containerRef, dependencies: [data] }); // Include 'data' dependency

  return (
    <div ref={containerRef} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales_volume" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="new_signups" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;