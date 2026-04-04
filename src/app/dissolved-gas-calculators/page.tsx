import DissolvedGasSuite from '../../components/dissolved-gas-analyzer/DissolvedGasSuite';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DissolvedGasCalculatorsPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
       {/* Minimal Nav Header */}
       <div className="container mx-auto px-4 py-8">
         <Link
           href="/"
           className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-cyan transition-colors font-mono"
         >
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
         </Link>
       </div>
       <DissolvedGasSuite />
    </div>
  )
}
