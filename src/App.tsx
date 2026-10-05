import { useState } from 'react';
import { elecciones23J } from './data/resultados23J';
import { partidos } from './data/partidos';
import { calcularDHondt } from './utils/calculoElectoral';

export default function App() {
  const [provinciaActiva, setProvinciaActiva] = useState<string>("18");
  const [partidoVotado, setPartidoVotado] = useState<string>("");

  // Blindaje 1: Comprobamos que los datos existan antes de usarlos
  const datosProvincia = elecciones23J.provincias[provinciaActiva as keyof typeof elecciones23J.provincias];
  const datosOficiales = elecciones23J.resultados_oficiales[provinciaActiva as keyof typeof elecciones23J.resultados_oficiales];

  // Si por algún desajuste no encuentra la provincia, muestra este mensaje en vez de pantalla blanca
  if (!datosProvincia || !datosOficiales) {
    return <div className="p-10 text-center font-bold text-red-500">Cargando base de datos...</div>;
  }

  const resultadosProvincia = datosOficiales.resultados || {};
  const votosTotales = datosOficiales.votos_totales_validos || 0;
  const escanosARepartir = datosProvincia.escanos || 0;

  const hemiciclo = calcularDHondt(votosTotales, resultadosProvincia, escanosARepartir);

  const miResultado = partidoVotado ? hemiciclo.find(r => r.partidoId === partidoVotado) : null;
  const infoMiPartido = partidoVotado ? partidos[partidoVotado as keyof typeof partidos] : null;
  
  // Blindaje 2: Calculamos si el partido no llegó al 3% legal
  const votosDeMiPartido = resultadosProvincia[partidoVotado] || 0;
  const barreraLegal = votosTotales * 0.03;
  const superoBarrera = votosDeMiPartido >= barreraLegal;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">¿Qué pasó con mi voto? 🗳️</h1>
          <p className="text-blue-100">Descubre si tu papeleta del 23-J logró un escaño o se perdió.</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* PASO 1 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Dónde votaste?</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium"
              value={provinciaActiva}
              onChange={(e) => {
                setProvinciaActiva(e.target.value);
                setPartidoVotado("");
              }}
            >
              {Object.keys(elecciones23J.resultados_oficiales).map((id) => {
                const prov = elecciones23J.provincias[id as keyof typeof elecciones23J.provincias];
                if (!prov) return null;
                return (
                  <option key={id} value={id}>
                    {prov.nombre} ({prov.escanos} escaños)
                  </option>
                );
              })}
            </select>
          </div>

          {/* PASO 2 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿A quién votaste?</label>
            
            {votosTotales === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                <span className="text-xl">🚧</span>
                <div>
                  <p className="font-bold">Datos en construcción</p>
                  <p className="text-sm mt-1">Todavía no hemos cargado los votos oficiales para esta provincia. ¡Elige otra mientras tanto!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(resultadosProvincia).map((id) => {
                  const info = partidos[id as keyof typeof partidos];
                  const isSelected = partidoVotado === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setPartidoVotado(id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: info?.color || '#ccc' }} />
                        <span className="font-bold">{info?.siglas || id.toUpperCase()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RESULTADO PERSONALIZADO */}
          {partidoVotado && infoMiPartido && (
            <div 
              className="mt-8 p-6 rounded-2xl border-l-8 animate-fade-in shadow-sm bg-slate-50"
              style={{ borderLeftColor: infoMiPartido.color }}
            >
              {!superoBarrera ? (
                <>
                  <h3 className="text-xl font-black mb-2 text-slate-800">
                    Tu voto se quedó en la barrera del 3% 🛑
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>{infoMiPartido.nombre}</strong> consiguió {votosDeMiPartido.toLocaleString('es-ES')} votos, pero la Ley Electoral exige un mínimo del 3% del total provincial ({Math.ceil(barreraLegal).toLocaleString('es-ES')} votos) para entrar en el reparto.
                  </p>
                </>
              ) : miResultado && miResultado.escanos > 0 ? (
                <>
                  <h3 className="text-xl font-black mb-2" style={{ color: infoMiPartido.color }}>
                    ¡Tu voto tuvo impacto directo! 🎉
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Tu papeleta ayudó a <strong>{infoMiPartido.nombre}</strong> a conseguir <strong>{miResultado.escanos} diputados</strong> en {datosProvincia.nombre}.
                  </p>
                  {miResultado.votosParaSiguienteEscano > 0 && (
                    <p className="text-sm mt-4 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      💡 <strong>Un dato curioso:</strong> Os faltaron {miResultado.votosParaSiguienteEscano.toLocaleString('es-ES')} votos para quitarle un escaño a <strong>{partidos[miResultado.aQuienQuita as keyof typeof partidos]?.siglas || miResultado.aQuienQuita}</strong>.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-xl font-black mb-2 text-slate-800">
                    Tu voto no alcanzó representación 😔
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Los <strong>{votosDeMiPartido.toLocaleString('es-ES')} votos</strong> de <strong>{infoMiPartido.nombre}</strong> superaron el 3%, pero la fórmula matemática D'Hondt no les dio para ganar un escaño.
                  </p>
                  {miResultado && (
                    <p className="text-sm mt-4 text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      💡 <strong>¿Qué habría hecho falta?</strong> Necesitabais {miResultado.votosParaSiguienteEscano.toLocaleString('es-ES')} votos más para arrebatarle el último escaño a <strong>{partidos[miResultado.aQuienQuita as keyof typeof partidos]?.siglas || miResultado.aQuienQuita}</strong>.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Hemiciclo final */}
          {partidoVotado && (
            <div className="pt-6 mt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Reparto final en {datosProvincia.nombre}
              </h4>
              <div className="flex flex-wrap gap-2">
                {hemiciclo.filter(r => r.escanos > 0).map(r => (
                  <span key={r.partidoId} className="px-3 py-1 bg-white text-slate-600 text-sm font-medium rounded-full border border-slate-200 shadow-sm">
                    {partidos[r.partidoId as keyof typeof partidos]?.siglas || r.partidoId}: <strong className="text-slate-900">{r.escanos}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}