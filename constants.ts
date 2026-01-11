
import { Type } from "@google/genai";

export const SYSTEM_PROMPT = `Tu es un expert en développement logiciel et en architecture IA. Ton rôle est de réviser du code de manière rigoureuse.
Pour chaque snippet fourni :
1. Analyse les bugs potentiels (erreurs de logique, types, cas limites).
2. Vérifie la sécurité (injections, fuites de données, gestion des secrets).
3. Évalue les performances (complexité algorithmique, utilisation mémoire).
4. Juge la lisibilité et les bonnes pratiques (DRY, SOLID, nommage, commentaires).

Fournis une réponse structurée en JSON uniquement, en français.
Le score doit refléter la qualité globale du code (0 à 100).`;

export const REVIEW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Un résumé global de la revue de code.",
    },
    score: {
      type: Type.NUMBER,
      description: "Une note de 0 à 100 basée sur la qualité du code.",
    },
    analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "La catégorie du problème (bug, security, performance, readability, best_practice).",
          },
          finding: {
            type: Type.STRING,
            description: "Le problème identifié.",
          },
          reasoning: {
            type: Type.STRING,
            description: "L'explication étape par étape de pourquoi c'est un problème.",
          },
          severity: {
            type: Type.STRING,
            description: "La gravité (low, medium, high).",
          },
        },
        required: ["category", "finding", "reasoning", "severity"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          fixedCode: { type: Type.STRING, description: "Un extrait de code corrigé si applicable." },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["summary", "score", "analysis", "recommendations"],
};
