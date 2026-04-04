"use client";

import { useEffect } from "react";

export default function CloudRunPinger() {
  useEffect(() => {
    // Ping the backend in the background to wake up the Cloud Run instance
    // This minimizes latency when the user eventually interacts with an API tool
    // 1. Wake up the Dissolved Gas Calculator engine
    fetch('https://bca-dissolved-gas-calculator-720721335459.us-central1.run.app/', { method: "GET" }).catch(() => {});
    
    // 2. Wake up the heavy Python physics engine for the UAS Simulator
    // Even an unauthenticated request forces the container to spin up and load TAMOC into memory!
    fetch('https://uas-plume-tracker-802451771317.us-west3.run.app/', { method: "GET" }).catch(() => {});
  }, []);
  
  return null;
}
