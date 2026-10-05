import { useState } from 'react';
import { elecciones23J } from './data/resultados23J';
import { partidos } from './data/partidos';
import { calcularDHondt } from './utils/calculoElectoral';

export default function App() {
  const [votos, setVotos] = useState(elecciones23J.resultados_oficiales);
  const [provinciaActiva, setProvinciaActiva] = useState<keyof typeof elecciones23J.resultados_oficiales>("18");

  const datosProvincia = elecciones23J.provincias[provinciaActiva];
  const simulacionActual = votos[provinciaActiva];

  const resultados = calcularDHondt(
    simulacionActual.votos_totales_validos,
    simulacionActual.resultados,
    datosProvincia.escanos
  );

  const getNombrePartido = (id: string) => {
    const p = partidos[id as keyof typeof partidos];
    return p ? p.siglas : id.toUpperCase();
  };

  const handleVotoChange = (partidoId: string, nuevosVotos: number) => {
    setVotos((prev) => {
      const prov = prev[provinciaActiva];
      const viejosVotos = prov.resultados[partidoId as keyof typeof prov.resultados] || 0;
      const diferencia = nuevosVotos - viejosVotos;

      return {
        ...prev,
        [provinciaActiva]: {
          ...prov,
          votos_totales_validos: prov.votos_totales_validos + diferencia,
          resultados: {
            ...prov.resultados,
            [partidoId]: nuevosVotos
          }
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Encabezado y Selector */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Simulador Electoral 🗳️</h1>
            <p className="text-sm text-slate-500">Cálculo de impacto y umbrales para escaño adicional</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Circunscripción:</label>
            <select
              className="p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
              value={provinciaActiva}
              onChange={(e) => setProvinciaActiva(e.target.value as keyof typeof elecciones23J.resultados_oficiales)}
            >
              {Object.keys(elecciones23J.resultados_oficiales).map((id) => (
                <option key={id} value={id}>
                  {elecciones23J.provincias[id as keyof typeof elecciones23J.provincias].nombre} ({elecciones23J.provincias[id as keyof typeof elecciones23J.provincias].escanos} escaños)
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* TABLA PRINCIPAL: Repercusión de votos */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Análisis de Voto Útil en {datosProvincia.nombre} ({datosProvincia.escanos} escaños)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Distancia matemática exacta para conseguir un diputado adicional o arrebatarlo al rival.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  <th className="py-3 px-4">Partido Político</th>
                  <th className="py-3 px-4 text-right">Votos</th>
                  <th className="py-3 px-4 text-center">Diputados Obtenidos</th>
                  <th className="py-3 px-4 text-right">Votos Extra para +1 Diputado</th>
                  <th className="py-3 px-4">¿A quién le quitarían ese escaño?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {resultados.map((r) => {
                  const info = partidos[r.partidoId as keyof typeof partidos];
                  const color = info ? info.color : '#64748b';
                  const nombre = info ? info.nombre : r.partidoId.toUpperCase();
                  const siglas = info ? info.siglas : r.partidoId.toUpperCase();

                  return (
                    <tr key={r.partidoId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span>{nombre} ({siglas})</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {r.votos.toLocaleString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-slate-800 bg-slate-100">
                          {r.escanos}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-amber-600">
                        +{r.votosParaSiguienteEscano.toLocaleString('es-ES')}
                      </td>
                      <td className="py-3 px-4">
                        {r.aQuienQuita !== "—" ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            {getNombrePartido(r.aQuienQuita)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sliders Interactivos */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Simular Variación de Votos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(simulacionActual.resultados).map(([partidoId, cantidadVotos]) => {
              const info = partidos[partidoId as keyof typeof partidos];
              const max = Math.max(elecciones23J.resultados_oficiales[provinciaActiva].votos_totales_validos, cantidadVotos * 1.5);

              return (
                <div key={partidoId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{info ? info.siglas : partidoId.toUpperCase()}</span>
                    <span className="font-mono">{cantidadVotos.toLocaleString('es-ES')} votos</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={max}
                    step="500"
                    value={cantidadVotos}
                    onChange={(e) => handleVotoChange(partidoId, parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200"
                    style={{ accentColor: info ? info.color : '#2563eb' }}
                  />
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}