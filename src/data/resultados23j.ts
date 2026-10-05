export const elecciones23J = {
  metadata: {
    fecha: "23 de Julio de 2023",
    tipo: "Elecciones Generales España",
    total_escanos_congreso: 350,
    // Resumen nacional de escaños que surgieron de estas elecciones:
    hemiciclo_nacional: {
      pp: 137,
      psoe: 121,
      vox: 33,
      sumar: 31,
      erc: 7,
      junts: 7,
      bildu: 6,
      pnv: 5,
      bng: 1,
      cc: 1,
      upn: 1
    }
  },

  // Las 52 circunscripciones con los escaños exactos que repartieron en 2023
  provincias: {
    "01": { id: "01", nombre: "Álava", escanos: 4 },
    "02": { id: "02", nombre: "Albacete", escanos: 4 },
    "03": { id: "03", nombre: "Alicante", escanos: 12 },
    "04": { id: "04", nombre: "Almería", escanos: 6 },
    "05": { id: "05", nombre: "Ávila", escanos: 3 },
    "06": { id: "06", nombre: "Badajoz", escanos: 5 },
    "07": { id: "07", nombre: "Baleares", escanos: 8 },
    "08": { id: "08", nombre: "Barcelona", escanos: 32 },
    "09": { id: "09", nombre: "Burgos", escanos: 4 },
    "10": { id: "10", nombre: "Cáceres", escanos: 4 },
    "11": { id: "11", nombre: "Cádiz", escanos: 9 },
    "12": { id: "12", nombre: "Castellón", escanos: 5 },
    "13": { id: "13", nombre: "Ciudad Real", escanos: 5 },
    "14": { id: "14", nombre: "Córdoba", escanos: 6 },
    "15": { id: "15", nombre: "A Coruña", escanos: 8 },
    "16": { id: "16", nombre: "Cuenca", escanos: 3 },
    "17": { id: "17", nombre: "Girona", escanos: 6 },
    "18": { id: "18", nombre: "Granada", escanos: 7 },
    "19": { id: "19", nombre: "Guadalajara", escanos: 3 },
    "20": { id: "20", nombre: "Guipúzcoa", escanos: 6 },
    "21": { id: "21", nombre: "Huelva", escanos: 5 },
    "22": { id: "22", nombre: "Huesca", escanos: 3 },
    "23": { id: "23", nombre: "Jaén", escanos: 5 },
    "24": { id: "24", nombre: "León", escanos: 4 },
    "25": { id: "25", nombre: "Lleida", escanos: 4 },
    "26": { id: "26", nombre: "La Rioja", escanos: 4 },
    "27": { id: "27", nombre: "Lugo", escanos: 4 },
    "28": { id: "28", nombre: "Madrid", escanos: 37 },
    "29": { id: "29", nombre: "Málaga", escanos: 11 },
    "30": { id: "30", nombre: "Murcia", escanos: 10 },
    "31": { id: "31", nombre: "Navarra", escanos: 5 },
    "32": { id: "32", nombre: "Ourense", escanos: 4 },
    "33": { id: "33", nombre: "Asturias", escanos: 7 },
    "34": { id: "34", nombre: "Palencia", escanos: 3 },
    "35": { id: "35", nombre: "Las Palmas", escanos: 8 },
    "36": { id: "36", nombre: "Pontevedra", escanos: 7 },
    "37": { id: "37", nombre: "Salamanca", escanos: 4 },
    "38": { id: "38", nombre: "Santa Cruz de Tenerife", escanos: 7 },
    "39": { id: "39", nombre: "Cantabria", escanos: 5 },
    "40": { id: "40", nombre: "Segovia", escanos: 3 },
    "41": { id: "41", nombre: "Sevilla", escanos: 12 },
    "42": { id: "42", nombre: "Soria", escanos: 2 },
    "43": { id: "43", nombre: "Tarragona", escanos: 6 },
    "44": { id: "44", nombre: "Teruel", escanos: 3 },
    "45": { id: "45", nombre: "Toledo", escanos: 6 },
    "46": { id: "46", nombre: "Valencia", escanos: 15 },
    "47": { id: "47", nombre: "Valladolid", escanos: 5 },
    "48": { id: "48", nombre: "Vizcaya", escanos: 8 },
    "49": { id: "49", nombre: "Zamora", escanos: 3 },
    "50": { id: "50", nombre: "Zaragoza", escanos: 7 },
    "51": { id: "51", nombre: "Ceuta", escanos: 1 },
    "52": { id: "52", nombre: "Melilla", escanos: 1 }
  },

  // Votos reales oficiales del 23-J por provincia. 
  // He añadido la propiedad "escanos_conseguidos" para que la app pueda comparar la realidad vs la simulación.
  resultados_oficiales: {
    "28": { // Madrid
      votos_totales_validos: 3519159,
      resultados: { pp: 1463112, psoe: 986934, sumar: 546255, vox: 492723 },
      escanos_conseguidos: { pp: 15, psoe: 11, sumar: 6, vox: 5 }
    },
    "08": { // Barcelona
      votos_totales_validos: 2639433,
      resultados: { psoe: 864491, sumar: 400490, pp: 362456, erc: 322306, junts: 256860 },
      escanos_conseguidos: { psoe: 13, sumar: 7, pp: 6, erc: 4, junts: 2 }
    },
    "46": { // Valencia
      votos_totales_validos: 1419736,
      resultados: { pp: 489375, psoe: 456891, sumar: 213239, vox: 216075 },
      escanos_conseguidos: { pp: 6, psoe: 5, sumar: 2, vox: 2 }
    },
    "41": { // Sevilla
      votos_totales_validos: 1079361,
      resultados: { psoe: 461623, pp: 279586, sumar: 142167, vox: 118431 },
      escanos_conseguidos: { psoe: 5, pp: 4, sumar: 2, vox: 1 }
    },
    "03": { // Alicante
      votos_totales_validos: 887640,
      resultados: { pp: 326880, psoe: 283187, vox: 142079, sumar: 114389 },
      escanos_conseguidos: { pp: 5, psoe: 4, vox: 2, sumar: 1 }
    },
    "29": { // Málaga
      votos_totales_validos: 757835,
      resultados: { pp: 289452, psoe: 228495, vox: 122240, sumar: 91523 },
      escanos_conseguidos: { pp: 5, psoe: 3, vox: 2, sumar: 1 }
    },
    "18": { // Granada
      votos_totales_validos: 504445,
      resultados: { pp: 186357, psoe: 165600, vox: 80164, sumar: 54101 },
      escanos_conseguidos: { pp: 3, psoe: 2, vox: 1, sumar: 1 }
    },
    "42": { // Soria
      votos_totales_validos: 49419,
      resultados: { pp: 18451, psoe: 14619, vox: 5219, sumar: 2577 },
      escanos_conseguidos: { pp: 1, psoe: 1, vox: 0, sumar: 0 }
    }
  }
} as const;