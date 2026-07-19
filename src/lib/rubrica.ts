// Rúbrica y banco de feedback de Chicas en IA.
// Texto usado tal cual fue provisto — no reformular.

export type Nivel = 3 | 2 | 1;

export interface EjeRubrica {
  key: "eje1" | "eje2" | "eje3" | "eje4";
  titulo: string;
  descripciones: Record<Nivel, string>;
  feedback: Record<Nivel, string>;
}

export const NIVEL_LABEL: Record<Nivel, string> = {
  3: "⭐ Logrado",
  2: "🔶 En proceso",
  1: "🔴 Por desarrollar",
};

export const EJES: EjeRubrica[] = [
  {
    key: "eje1",
    titulo: "Identificación del problema",
    descripciones: {
      3: "Identifica un problema concreto y relevante de su comunidad local. El problema está bien delimitado, es específico y se vincula claramente con los ODS. Se evidencia investigación o indagación previa (entrevistas, observación, datos).",
      2: "Identifica un problema general relacionado con su entorno, pero le falta especificidad o conexión explícita con los ODS. El problema es comprensible aunque podría estar mejor delimitado.",
      1: "El problema no está claramente definido, es demasiado amplio o no se relaciona con la comunidad ni con los ODS. No se evidencia proceso de indagación.",
    },
    feedback: {
      3: "¡Muy buen trabajo! Identificaste un problema real de tu comunidad con mucha claridad y lo conectaste con los Objetivos de Desarrollo Sostenible. Eso muestra compromiso genuino con generar impacto. ¡Tu enfoque es una base sólida para todo el proyecto!",
      2: "Tu problema tiene mucho potencial. Te recomendamos enfocarlo un poco más: ¿a quién afecta específicamente? ¿Por qué es urgente resolverlo ahora? Conectarlo con un ODS puede darte una dirección más clara.",
      1: "Es un buen momento para reforzar la definición del problema. Puedes conversar con personas de tu comunidad, observar situaciones cotidianas o investigar datos. Cuanto más claro sea el problema, más impacto tendrá tu solución.",
    },
  },
  {
    key: "eje2",
    titulo: "Aplicación de Design Thinking",
    descripciones: {
      3: "Aplica las etapas del Design Thinking (Empatizar, Definir, Idear, Prototipar, Testear) de manera visible y articulada en su proyecto. Define con claridad su usuario/a y presenta una pregunta problematizadora específica y desafiante.",
      2: "Aplica algunas etapas del Design Thinking, aunque no todas están desarrolladas con la misma profundidad. El usuario está identificado pero de forma general; la pregunta problematizadora es válida aunque puede mejorarse.",
      1: "No se evidencia aplicación del Design Thinking o las etapas están muy incompletas. No queda claro quién es el/la usuario/a ni cuál es el desafío a resolver.",
    },
    feedback: {
      3: "¡Excelente! Se nota que trabajaste cada etapa del Design Thinking con dedicación. Definiste claramente a tu usuaria/o y formulaste una pregunta problematizadora desafiante y bien acotada. Esa base metodológica le da solidez a todo tu proyecto.",
      2: "Aplicaste varias etapas del Design Thinking, ¡eso es un gran avance! Para profundizar, puedes revisar la definición de tu usuario/a: ¿qué hace en un día típico? ¿Qué le frustra? Conocerlo/a mejor te va a ayudar a diseñar una solución más acertada.",
      1: "El Design Thinking es el corazón del proceso de diseño. Te invitamos a retomar las etapas: empezar por empatizar con alguien que viva el problema puede darte ideas que no imaginabas. ¡Cada paso que des suma!",
    },
  },
  {
    key: "eje3",
    titulo: "Prototipo visual funcional con integración de IA",
    descripciones: {
      3: "Presenta un prototipo visual funcional (digital o analógico) que refleja la solución al problema. El prototipo integra de manera clara y pertinente al menos un concepto o herramienta de IA trabajado en la ruta Chicas en IA. El diseño es coherente y tiene identidad visual.",
      2: "Presenta un prototipo con avances visibles pero incompleto o con aspectos de la interfaz/diseño por mejorar. La integración de elementos de IA es básica o parcial. Se comprende la idea general de la solución.",
      1: "El prototipo es muy incipiente, no está funcional o no se presenta. No se evidencia integración de conceptos de IA de la ruta formativa.",
    },
    feedback: {
      3: "¡Gran trabajo! Tu prototipo refleja con claridad la solución que imaginaste y muestra cómo los conceptos de IA del programa se integran de manera relevante. La identidad visual le da profesionalismo y lo hace memorable. ¡Estás lista para mostrarlo al mundo!",
      2: "Tu prototipo muestra una idea con mucho potencial. Para llevarla al siguiente nivel, puedes pensar en qué función de IA podría potenciar la experiencia de tu usuaria/o, y seguir refinando el diseño visual. ¡Cada pantalla o sección que agregas hace crecer tu proyecto!",
      1: "Un prototipo, aunque sea básico, es fundamental para dar vida a tu idea. Puedes empezar representando solo la pantalla principal o el flujo más importante. Y recuerda: la ruta Chicas en IA tiene herramientas y conceptos de IA que puedes incorporar. ¡Anímate a dar ese primer paso!",
    },
  },
  {
    key: "eje4",
    titulo: "Elevator Pitch (en vivo o grabado)",
    descripciones: {
      3: "El pitch comunica con claridad y convicción: el problema, la solución, la propuesta de valor y un llamado a la acción. La presentación está bien estructurada, es persuasiva y tiene un acompañamiento visual o narrativo atractivo. Se percibe seguridad y entusiasmo.",
      2: "El pitch transmite la idea central del proyecto, pero le falta claridad, estructura o convicción en alguno de sus elementos. La presentación es comprensible aunque puede profundizarse.",
      1: "El pitch no fue presentado o no logra comunicar con claridad el problema ni la solución. Falta estructura y elementos clave (introducción, propuesta de valor, llamado a la acción).",
    },
    feedback: {
      3: "¡Tu pitch es claro, persuasivo y genera impacto! Lograste comunicar el problema, la solución y la propuesta de valor con seguridad y entusiasmo. Animarse a presentar —en vivo o grabado— ya es un gran logro. ¡Sigue practicando, tienes una habilidad que va a abrirte muchas puertas!",
      2: "¡Ya diste el paso más importante: presentar tu proyecto! Para mejorar tu pitch, revisa si están todos los elementos: introducción, problema, solución, propuesta de valor y llamado a la acción. Practicarlo en voz alta o grabándote puede ayudarte a ganar fluidez y confianza.",
      1: "Comunicar tus ideas es una habilidad que se entrena. Puedes empezar preparando una mini presentación con tres preguntas clave: ¿qué problema resuelves?, ¿cómo lo resuelves?, ¿por qué tu solución es diferente? Contarlo con claridad ya es el primer paso para generar impacto.",
    },
  },
];

export interface ScoreInput {
  eje1: number | null;
  eje2: number | null;
  eje3: number | null;
  eje4: number | null;
}

export function totalScore({ eje1, eje2, eje3, eje4 }: ScoreInput): number {
  return (eje1 ?? 0) + (eje2 ?? 0) + (eje3 ?? 0) + (eje4 ?? 0);
}

export function escalaLabel(total: number): string {
  if (total >= 10) return "Logrado";
  if (total >= 7) return "En proceso";
  if (total >= 4) return "Por desarrollar";
  return "Requiere acompañamiento intensivo";
}
