import React from 'react';

export interface ResultValue {
  value: number | number[] | string;
  units: string;
  'nice name': string | string[];
}

interface ResultsProps {
  data: Record<string, ResultValue>;
  mode: 'conc' | 'fraction' | 'seawater';
}

export function ResultsTable({ data, mode }: ResultsProps) {
  if (!data) return null;

  const envKeys = Object.keys(data).filter(k => k !== 'concG' && k !== 'partialP' && k !== 'Saturation_Percent' && !k.endsWith('sat_umol_kgsw'));
  const satGasKeys = Object.keys(data).filter(k => k.endsWith('sat_umol_kgsw'));
  const gasData = data['concG'] || data['partialP'];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Seawater Properties Table */}
        <div className="w-full max-w-[450px]">
          <h3 className="text-center font-bold text-gray-200 mb-2">Seawater Properties</h3>
          <table className="w-full text-sm border-collapse border border-gray-700 bg-gray-900/30">
            <colgroup>
              <col className="w-[160px]" />
              <col className="w-[60px]" />
              <col className="w-[90px]" />
            </colgroup>
            <thead>
              <tr className="bg-gray-800/80">
                <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Parameter</th>
                <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Value</th>
                <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Unit</th>
              </tr>
            </thead>
            <tbody>
              {envKeys.map(k => (
                <tr key={k}>
                  <td className="border border-gray-700 p-1.5 text-gray-300 break-words">{data[k]['nice name'] as string}</td>
                  <td className="border border-gray-700 p-1.5 text-cyan break-words">{String(data[k].value)}</td>
                  <td className="border border-gray-700 p-1.5 text-gray-400 break-words">{data[k].units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mode === 'seawater' ? (
          <div className="w-full max-w-[450px]">
            <h3 className="text-center font-bold text-gray-200 mb-2">Atm. Saturated Dissolved Gas</h3>
            <table className="w-full text-sm border-collapse border border-gray-700 bg-gray-900/30">
              <colgroup>
                <col className="w-[160px]" />
                <col className="w-[80px]" />
                <col className="w-[150px]" />
              </colgroup>
              <thead>
                <tr className="bg-gray-800/80">
                  <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Parameter</th>
                  <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Value</th>
                  <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Unit</th>
                </tr>
              </thead>
              <tbody>
                {satGasKeys.map((k) => (
                  <tr key={k}>
                    <td className="border border-gray-700 p-1.5 text-gray-300 break-words font-bold">{data[k]['nice name'] as string}</td>
                    <td className="border border-gray-700 p-1.5 text-cyan break-words">{String(data[k].value)}</td>
                    <td className="border border-gray-700 p-1.5 text-gray-400 break-words">{data[k].units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full max-w-[450px]">
             <h3 className="text-center font-bold text-gray-200 mb-2">
               {mode === 'conc' ? 'Dry Partial Pressure' : 'Dissolved Gases'}
             </h3>
             {gasData && Array.isArray(gasData.value) ? (
               <table className="w-full text-sm border-collapse border border-gray-700 bg-gray-900/30">
                 <colgroup>
                   <col className="w-[160px]" />
                   <col className="w-[80px]" />
                   <col className="w-[150px]" />
                 </colgroup>
                 <thead>
                   <tr className="bg-gray-800/80">
                     <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Parameter</th>
                     <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Value</th>
                     <th className="border border-gray-700 p-1.5 text-left font-bold text-white">Unit</th>
                   </tr>
                 </thead>
                 <tbody>
                   {(gasData['nice name'] as string[]).map((name, i) => (
                     <tr key={name}>
                       <td className="border border-gray-700 p-1.5 text-gray-300 break-words font-bold">{name}</td>
                       <td className="border border-gray-700 p-1.5 text-cyan break-words">{(gasData.value as number[])[i]}</td>
                       <td className="border border-gray-700 p-1.5 text-gray-400 break-words">{gasData.units}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
