export interface ResultadoEscano {
  partidoId: string;
  escanos: number;
  votos: number;
  votosParaSiguienteEscano: number; // Distancia en votos para ganar el próximo diputado
}

export function calcularDHondt(
  votosTotalesValidos: number,
  resultadosVotos: Record<string, number>,
  escanosARepartir: number
): ResultadoEscano[] {
  const BARRERA_LEGAL = 0.03; // 3%
  const umbralVotos = votosTotalesValidos * BARRERA_LEGAL;

  // 1. Descartar partidos que no superan la barrera electoral
  const partidosValidos = Object.entries(resultadosVotos)
    .filter(([_, votos]) => votos >= umbralVotos)
    .map(([id, votos]) => ({ id, votos, escanos: 0 }));

  if (partidosValidos.length === 0) return [];

  const cocientesGanadores: number[] = [];

  // 2. Repartir escaños iterativamente (Ley D'Hondt)
  for (let i = 0; i < escanosARepartir; i++) {
    let maxCociente = -1;
    let partidoGanadorIndex = -1;

    for (let j = 0; j < partidosValidos.length; j++) {
      const partido = partidosValidos[j];
      const cociente = partido.votos / (partido.escanos + 1);

      if (cociente > maxCociente) {
        maxCociente = cociente;
        partidoGanadorIndex = j;
      }
    }

    if (partidoGanadorIndex !== -1) {
      partidosValidos[partidoGanadorIndex].escanos++;
      cocientesGanadores.push(maxCociente);
    }
  }

  // 3. Calcular la métrica de probabilidad/distancia para el siguiente escaño
  // El cociente de corte es el último cociente que logró llevarse un escaño.
  const cocienteDeCorte = cocientesGanadores[cocientesGanadores.length - 1] || 0;

  return partidosValidos
    .map(partido => {
      // Para ganar un escaño MÁS del que ya tiene, su nuevo cociente debe superar al cociente de corte.
      // Votos Necesarios = Cociente de Corte * (Escaños Actuales + 1)
      const votosNecesarios = cocienteDeCorte * (partido.escanos + 1);
      
      // Calculamos la diferencia y sumamos 1 voto para desempatar y superar la marca
      const diferencia = Math.ceil(votosNecesarios - partido.votos) + 1;
      
      return {
        partidoId: partido.id,
        escanos: partido.escanos,
        votos: partido.votos,
        // Si la diferencia es negativa, significa que ese partido fue el que marcó el corte.
        // En ese caso, la distancia es 0 (ya lo tiene asegurado, su lucha es mantenerlo).
        votosParaSiguienteEscano: diferencia > 0 ? diferencia : 0
      };
    })
    .sort((a, b) => b.escanos - a.escanos || b.votos - a.votos);
}