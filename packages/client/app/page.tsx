// client/pages/index.tsx

"use client"; // This component needs client-side features like useState and useEffect

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth'; // <-- Import the hook
import KpiSphereWidget from '@/components/kpiSphere';
import ChartCard from '@/components/chartCard';
import './styles.css';


interface DataPoint {
  date: string;
  sales_volume: number;
  new_signups: number;
  active_users: number;
  kpi_score: number;
  region: string;
}

// This retrieves the variable set in .env.local or your hosting platform
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardPage = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
            // User is NOT logged in, redirect them immediately
            router.push('/auth/signup');
        }
    // IMPORTANT: In a production app, the token should be managed securely
    // (e.g., stored in HTTP-only cookies, or local storage with careful consideration).
    // For local development, paste a valid token you get from /api/auth/login.
    const storedAuthData = localStorage.getItem('authData');
    const {token} =  JSON.parse(storedAuthData!) ; // <-- REPLACE THIS WITH YOUR ACTUAL JWT TOKEN

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/data/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err: any) {
        setError("Failed to fetch dashboard data. Please check if the API is running and your token is valid.");
        console.error("Dashboard data fetch error:", err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, isLoading, router]); // Empty dependency array means this runs once after initial render

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Analytics Dashboard...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;

  return (
    <main style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>AnalyticsSphere Dashboard</h1>
      
      <div className='holder'>
          
          {/* 1. Kpi Widget */}
          <div className='kpi'>
              <KpiSphereWidget />
          </div>

          {/* 2. GSAP Animated Chart */}
          <div style={{ display: 'grid', gap: '20px' }}>
    {loading ? <div>Loading charts...</div> : (
        <>
            {/* First Card (delayIndex 0) */}
            <ChartCard data={data} title="Sales & Signups Overview" delayIndex={0} /> 
            
            {/* Second Card (delayIndex 1) - starts 0.2s after the first */}
            <ChartCard data={data.filter(d => d.region === 'North')} title="North Region Performance" delayIndex={1} /> 
        </>
    )}
</div>
      </div>
    </main>
  );
};

export default DashboardPage;