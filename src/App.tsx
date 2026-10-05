import { useState } from 'react';
import { elecciones23J } from './data/resultados23J';
import { partidos } from './data/partidos';
import { calcularDHondt } from './utils/calculoElectoral';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  // Inicializamos el estado mutable con los datos reales del 23-J
  const [votos, setVotos] = useState(elecciones23J.resultados_oficiales);
  
  // Provincias disponibles con datos cargados
  const provinciasDisponibles = Object.keys(elecciones23J.resultados_oficiales) as Array<
    keyof typeof elecciones23J.resultados_oficiales
  >;

  // Provincia seleccionada por defecto (Granada: 18)
  const [provinciaActiva, setProvinciaActiva] = useState<keyof typeof elecciones23J.resultados_oficiales>("18");

  const datosProvincia = elecciones23J.provincias[provinciaActiva];
  const simulacionActual = votos[provinciaActiva];

  // Cálculo D'Hondt reactivo
  const resultados = calcularDHondt(
    simulacionActual.votos_totales_validos,
    simulacionActual.resultados,
    datosProvincia.escanos
  );

  // Formato para Recharts
  const chartData = resultados.map((r) => {
    const partidoInfo = partidos[r.partidoId as keyof typeof partidos];
    return {
      nombre: partidoInfo ? partidoInfo.siglas : r.partidoId.toUpperCase(),
      escanos: r.escanos,
      color: partidoInfo ? partidoInfo.color : '#6b7280'
    };
  });

  const handleVotoChange = (partidoId: string, nuevosVotos: number) => {
    setVotos((prev) => {
      const provinciaData = prev[provinciaActiva];
      const viejosVotos = provinciaData.resultados[partidoId as keyof typeof provinciaData.resultados] || 0;
      const diferencia = nuevosVotos - viejosVotos;

      return {
        ...prev,
        [provinciaActiva]: {
          ...provinciaData,
          votos_totales_validos: provinciaData.votos_totales_validos + diferencia,
          resultados: {
            ...provinciaData.resultados,
            [partidoId]: nuevosVotos
          }
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: Controles */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
          <header className="mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800">Simulador Electoral 🗳️</h1>
            <p className="text-xs text-gray-500 mt-1">Base de partida: Resultados oficiales 23-J</p>
            
            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
              Circunscripción:
            </label>
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={provinciaActiva}
              onChange={(e) => setProvinciaActiva(e.target.value as keyof typeof elecciones23J.resultados_oficiales)}
            >
              {provinciasDisponibles.map((id) => {
                const prov = elecciones23J.provincias[id];
                return (
                  <option key={id} value={id}>
                    {prov.nombre} ({prov.escanos} escaños)
                  </option>
                );
              })}
            </select>
          </header>

          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Laboratorio de Votos</h3>
            <div className="space-y-6">
              {Object.entries(simulacionActual.resultados).map(([partidoId, cantidadVotos]) => {
                const infoPartido = partidos[partidoId as keyof typeof partidos];
                // El tope del slider se basa en el total de votos válidos de la provincia
                const maxSlider = Math.max(
                  elecciones23J.resultados_oficiales[provinciaActiva].votos_totales_validos,
                  cantidadVotos * 1.5
                );

                return (
                  <div key={partidoId} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800">
                        {infoPartido ? infoPartido.nombre : partidoId.toUpperCase()}
                      </span>
                      <span className="font-mono bg-white px-2 py-1 rounded border text-sm">
                        {cantidadVotos.toLocaleString('es-ES')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={maxSlider}
                      step="500"
                      value={cantidadVotos}
                      onChange={(e) => handleVotoChange(partidoId, parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ 
                        accentColor: infoPartido ? infoPartido.color : '#3b82f6', 
                        backgroundColor: '#e5e7eb' 
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: Resultados */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-fit flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Hemiciclo: {datosProvincia.nombre}
          </h2>
          
          <div className="w-full h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="nombre" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="escanos" radius={[4, 4, 0, 0]} animationDuration={300}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 flex-1">
            {resultados.map((resultado) => {
              const infoPartido = partidos[resultado.partidoId as keyof typeof partidos];
              const siglas = infoPartido ? infoPartido.siglas : resultado.partidoId.toUpperCase();
              const color = infoPartido ? infoPartido.color : '#9ca3af';

              return (
                <div 
                  key={resultado.partidoId} 
                  className="p-4 bg-gray-50 border rounded-lg flex items-center justify-between transition-all" 
                  style={{ borderLeftWidth: '6px', borderLeftColor: color }}
                >
                  <div>
                    <span className="font-bold text-xl text-gray-900">{siglas}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-800">
                      {resultado.escanos} <span className="text-sm font-normal text-gray-500">dip.</span>
                    </div>
                    {resultado.votosParaSiguienteEscano > 0 ? (
                      <div className="text-xs text-red-500 mt-1 font-medium">
                        A {resultado.votosParaSiguienteEscano.toLocaleString('es-ES')} del siguiente
                      </div>
                    ) : (
                      <div className="text-xs text-green-600 mt-1 font-medium">
                        Cierra el reparto
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}