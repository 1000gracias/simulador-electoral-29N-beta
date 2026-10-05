export interface ResultadoEscano {
  partidoId: string;
  escanos: number;
  votos: number;
  votosParaSiguienteEscano: number;
  aQuienQuita: string;
}

interface Asignacion {
  partidoId: string;
  cociente: number;
}

export function calcularDHondt(
  votosTotalesValidos: number,
  resultadosVotos: Record<string, number>,
  escanosARepartir: number
): ResultadoEscano[] {
  const BARRERA_LEGAL = 0.03;
  const umbralVotos = votosTotalesValidos * BARRERA_LEGAL;

  const partidosValidos = Object.entries(resultadosVotos)
    .filter(([_, votos]) => votos >= umbralVotos)
    .map(([id, votos]) => ({ id, votos, escanos: 0 }));

  if (partidosValidos.length === 0) return [];

  const asignaciones: Asignacion[] = [];

  // Repartir escaños
  for (let i = 0; i < escanosARepartir; i++) {
    let maxCociente = -1;
    let ganadorIdx = -1;

    for (let j = 0; j < partidosValidos.length; j++) {
      const p = partidosValidos[j];
      const cociente = p.votos / (p.escanos + 1);
      if (cociente > maxCociente) {
        maxCociente = cociente;
        ganadorIdx = j;
      }
    }

    if (ganadorIdx !== -1) {
      partidosValidos[ganadorIdx].escanos++;
      asignaciones.push({
        partidoId: partidosValidos[ganadorIdx].id,
        cociente: maxCociente
      });
    }
  }

  // El último escaño asignado es la barrera a superar
  const ultimoEscano = asignaciones[asignaciones.length - 1];
  const penultimoEscano = asignaciones.length > 1 ? asignaciones[asignaciones.length - 2] : null;

  return partidosValidos.map((partido) => {
    let votosNecesarios = 0;
    let victima = "—";

    if (!ultimoEscano) {
      return {
        partidoId: partido.id,
        escanos: partido.escanos,
        votos: partido.votos,
        votosParaSiguienteEscano: 0,
        aQuienQuita: "—"
      };
    }

    if (partido.id === ultimoEscano.partidoId) {
      // Si el partido ya tiene el último escaño, para ganar OTRO debe superar al penúltimo
      if (penultimoEscano) {
        votosNecesarios = Math.ceil(penultimoEscano.cociente * (partido.escanos + 1)) - partido.votos + 1;
        victima = penultimoEscano.partidoId;
      }
    } else {
      // Cualquier otro partido debe superar el cociente del último escaño
      votosNecesarios = Math.ceil(ultimoEscano.cociente * (partido.escanos + 1)) - partido.votos + 1;
      victima = ultimoEscano.partidoId;
    }

    return {
      partidoId: partido.id,
      escanos: partido.escanos,
      votos: partido.votos,
      votosParaSiguienteEscano: Math.max(0, votosNecesarios),
      aQuienQuita: victima
    };
  }).sort((a, b) => b.escanos - a.escanos || b.votos - a.votos);
}