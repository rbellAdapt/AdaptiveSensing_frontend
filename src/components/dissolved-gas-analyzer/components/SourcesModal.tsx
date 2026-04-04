"use client";

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SourcesModal({ isOpen, onClose }: SourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#122B4A] border border-cyan/40 p-6 rounded-none w-full max-w-4xl shadow-2xl relative text-left h-auto max-h-[85vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold font-sans text-white mb-6 border-b border-gray-700 pb-2">Academic Sources & Math References</h2>
        
        <ul className="text-sm text-gray-300 space-y-4 font-sans list-disc pl-5">
          <li>McDougall, T.J. and P.M. Barker, 2011: Getting started with TEOS-10 and the Gibbs Seawater (GSW) Oceanographic Toolbox, 28pp., SCOR/IAPSO WG127, ISBN 978-0-646-55621-5.</li>
          <li>Humphreys, M. P., Schiller, A. J., Sandborn, D. E., Gregor, L., Pierrot, D., van Heuven, S. M. A. C., Lewis, E. R., and Wallace, D. W. R. (2024). PyCO2SYS: marine carbonate system calculations in Python. Zenodo. doi:10.5281/zenodo.3744275.</li>
          <li>Garcia, H. E.; Gordon, L. I. Oxygen Solubility in Seawater: Better Fitting Equations. Limnol. Oceanogr. 1992, 37 (6), 1307–1312. <a href="https://doi.org/10.4319/lo.1992.37.6.1307" target="_blank" className="text-cyan hover:underline hover:text-white">https://doi.org/10.4319/lo.1992.37.6.1307</a>.</li>
          <li>Hamme, R. C.; Emerson, S. R. The Solubility of Neon, Nitrogen and Argon in Distilled Water and Seawater. Deep Sea Res. Part I 2004, 51 (11), 1517–1528. <a href="https://doi.org/10.1016/j.dsr.2004.06.009" target="_blank" className="text-cyan hover:underline hover:text-white">https://doi.org/10.1016/j.dsr.2004.06.009</a>.</li>
          <li>Jenkins, W. J.; Lott, D. E.; Cahill, K. L. A Determination of Atmospheric Helium, Neon, Argon, Krypton, and Xenon Solubility Concentrations in Water and Seawater. Marine Chemistry 2019, 211, 94–107. <a href="https://doi.org/10.1016/j.marchem.2019.03.007" target="_blank" className="text-cyan hover:underline hover:text-white">https://doi.org/10.1016/j.marchem.2019.03.007</a>.</li>
          <li>Wiesenburg, D.A.; Guinasso, N.L. Equilibrium Solubilities of Methane, Carbon Monoxide, and Hydrogen in Water and Seawater. J. Chem. Eng. Data, 1979, 24(4), 356–360. <a href="https://doi.org/10.4319/lo.1992.37.6.1307" target="_blank" className="text-cyan hover:underline hover:text-white">https://doi.org/10.1021/je60083a006</a>.</li>
          <li>H. L. Clever and C. L. Young, Eds., IUPAC Solubility Data Series, Vol. 27/28, Methane, Pergamon Press, Oxford, England, 1987.</li>
        </ul>
      </div>
    </div>
  );
}
