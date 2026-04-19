"use client";

import { useEffect } from "react";

export default function CloudRunPinger() {
  useEffect(() => {
    // Wake up the heavy Python physics engine for the UAS Simulator
    // Even an unauthenticated request forces the container to spin up and load TAMOC into memory!
    fetch('https://uas-plume-tracker-802451771317.us-west3.run.app/', { method: "GET" }).catch(() => {});
  }, []);
  
  return null;
}
