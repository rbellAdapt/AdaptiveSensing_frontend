import FicksLawVisualizer from "@/components/ui/FicksLawVisualizer";

export default function FicksLawPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-200 mb-8 font-sans">Fick's Law Diffusion Calculator</h1>
      <FicksLawVisualizer />
    </div>
  );
}
