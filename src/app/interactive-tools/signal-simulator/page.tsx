import SignalVisualizer from "@/components/ui/SignalVisualizer";

export default function SignalSimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-200 mb-8 font-sans">DSP Signal Visualizer</h1>
      <SignalVisualizer />
    </div>
  );
}
