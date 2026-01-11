
# CodeReview AI Agent

Cet agent d'IA est conçu pour aider les développeurs à réviser leur code automatiquement en utilisant la puissance de Gemini 3 Pro.

## Fonctionnalités

- **Analyse Multidimensionnelle** : Détecte les bugs, les failles de sécurité, les goulots d'étranglement de performance et les problèmes de lisibilité.
- **Raisonnement Étape par Étape** : L'IA explique *pourquoi* un changement est nécessaire.
- **Recommandations Concrètes** : Propose des extraits de code corrigés prêts à l'emploi.
- **Score de Qualité** : Une note de 0 à 100 pour évaluer rapidement l'état du code.
- **Historique** : Garde une trace de vos 10 dernières analyses localement.

## Installation & Utilisation

1. Assurez-vous d'avoir une clé API valide définie dans l'environnement (`process.env.API_KEY`).
2. Lancez l'application.
3. Collez votre code dans l'éditeur à gauche.
4. Sélectionnez le langage approprié.
5. Cliquez sur **"Lancer la Revue"**.

## Architecture technique

- **Frontend** : React 18, TypeScript, Tailwind CSS.
- **IA** : SDK Google GenAI (`@google/genai`) avec le modèle `gemini-3-pro-preview`.
- **Analyse** : Utilise une configuration `responseSchema` stricte pour garantir des résultats JSON structurés et typés.

---
*Note : Cette application s'exécute entièrement côté client pour une réactivité maximale.*
