export const forces = {
  consolidation: {
    name: "Consolidation",
    form: "personal",
    anchor: "Efficiency",
    description: "The drive to pull many efforts into one coherent direction, often through a central chief.",
    containment: "Give the chief a clear resource constraint. Efficiency disciplines personal power without silencing it."
  },
  efficiency: {
    name: "Efficiency",
    form: "programmed",
    anchor: "Collaboration",
    description: "The drive to get more output from fewer resources by making work repeatable and predictable.",
    containment: "Protect small pockets of open collaboration so the machine can adapt without losing its operational discipline."
  },
  proficiency: {
    name: "Proficiency",
    form: "professional",
    anchor: "Collaboration",
    description: "The drive to protect expert skill, quality, and judgment in the hands of trained professionals.",
    containment: "Create cross-category teams so expert autonomy stays connected to the whole organization and the needs between categories."
  },
  collaboration: {
    name: "Collaboration",
    form: "project",
    anchor: "Efficiency",
    description: "The drive to coordinate experts through mutual adjustment in order to create something novel.",
    containment: "Set a real resource envelope and clear project boundaries so collaborative exploration remains viable over time."
  },
  separation: {
    name: "Separation",
    form: "divisional",
    anchor: "Collaboration",
    description: "The drive to give units autonomy while holding them to distinct results and performance targets.",
    containment: "Build lateral links and shared experiments across divisions so output controls do not turn every unit into a separate machine."
  },
  culture: {
    name: "Culture",
    form: "community",
    anchor: "Collaboration",
    description: "The drive to bind people through common norms, identity, and a compelling mission.",
    containment: "Use cross-boundary collaboration to keep the culture open to outside experience, dissent, and adaptation."
  },
  conflict: {
    name: "Conflict",
    form: "political",
    anchor: "Culture",
    description: "The drive to contest power, priorities, and direction when legitimate systems no longer settle differences.",
    containment: "Let culture contain destructive conflict, then rebuild a legitimate coordinating mechanism. An arena is a bridge, not a durable home."
  }
};

export const presets = {
  founding: { consolidation: 88, efficiency: 32, proficiency: 22, collaboration: 44, separation: 18, culture: 62, conflict: 18 },
  scaling: { consolidation: 38, efficiency: 86, proficiency: 44, collaboration: 28, separation: 60, culture: 35, conflict: 22 },
  expertise: { consolidation: 30, efficiency: 36, proficiency: 92, collaboration: 54, separation: 28, culture: 48, conflict: 24 },
  innovation: { consolidation: 28, efficiency: 24, proficiency: 68, collaboration: 94, separation: 24, culture: 52, conflict: 28 },
  diversify: { consolidation: 38, efficiency: 62, proficiency: 46, collaboration: 30, separation: 92, culture: 40, conflict: 34 },
  mission: { consolidation: 28, efficiency: 22, proficiency: 36, collaboration: 62, separation: 18, culture: 96, conflict: 20 },
  conflict: { consolidation: 24, efficiency: 30, proficiency: 38, collaboration: 26, separation: 44, culture: 42, conflict: 96 },
  balanced: { consolidation: 55, efficiency: 55, proficiency: 55, collaboration: 55, separation: 55, culture: 55, conflict: 55 }
};
