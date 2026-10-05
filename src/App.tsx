{/* PASO 2: Elegir Partido o Aviso de Datos Faltantes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿A quién votaste?</label>
            
            {elecciones23J.resultados_oficiales[provinciaActiva].votos_totales_validos === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                <span className="text-xl">🚧</span>
                <div>
                  <p className="font-bold">Datos en construcción</p>
                  <p className="text-sm mt-1">Todavía no hemos cargado los votos oficiales del Ministerio para esta provincia en el código. ¡Elige otra provincia de la lista mientras tanto!</p>
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
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: info ? info.color : '#ccc' }} />
                        <span className="font-bold">{info ? info.siglas : id.toUpperCase()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>