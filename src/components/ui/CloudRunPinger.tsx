"use client";

import { useEffect } from "react";

export default function CloudRunPinger() {
  useEffect(() => {
    // Ping the backend in the background to wake up the Cloud Run instance
    // This minimizes latency when the user eventually interacts with an API tool
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://adaptivesensing-api-107301792697.us-central1.run.app';
    
    // 1. Wake up the main corporate API
    fetch(`${apiUrl}/`, { method: "GET" }).catch(() => {});
    
    // 2. Wake up the heavy Python physics engine for the UAS Simulator
    // Even an unauthenticated request forces the container to spin up and load TAMOC into memory!
    fetch('https://uas-plume-tracker-802451771317.us-west3.run.app/', { method: "GET" }).catch(() => {});
  }, []);
  
  return null;
}
