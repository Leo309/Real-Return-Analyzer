// Traductions françaises
export const fr = {
  common: {
    back: 'Retour',
    next: 'Suivant',
    calculate: 'Calculer',
    selectRegion: 'Sélectionnez votre région',
    selectInvestment: 'Choisissez le type d\'investissement',
    years: 'années',
    dataAvailable: 'Données disponibles',
    from: 'de',
    to: 'à',
    submit: 'Soumettre',
    feedback: 'Commentaires',
    feedbackThankYou: 'Merci pour vos commentaires !',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
  },
  regionSelector: {
    title: 'Où investissez-vous ?',
    subtitle: 'Sélectionnez votre région pour commencer avec des données d\'investissement spécifiques',
    dataYearsLabel: '{startYear}-{endYear}',
    dataCompleteness: {
      full: 'Données complètes',
      partial: 'Données partielles',
      limited: 'Données limitées'
    }
  },
  investmentSelector: {
    title: 'Choisissez votre type d\'investissement',
    subtitle: 'Découvrez comment différentes stratégies d\'investissement auraient performé dans',
    availableYears: '{years} années de données ({startYear}-{endYear})',
    dataNote: 'Note sur la couverture des données',
    selectButton: 'Sélectionner cet investissement',
    backToRegions: 'Changer de région',
    historicalReturn: 'Rendement historique moyen : {returnRate}%'
  },
  calculator: {
    title: 'Analyseur de Rendement Réel',
    subtitle: 'Voyez comment l\'inflation et les investissements affectent votre argent au fil du temps',
    initialAmount: 'Montant Initial',
    startYear: 'Année de Début',
    endYear: 'Année de Fin',
    inflationImpact: 'Impact de l\'Inflation',
    investmentPerformance: 'Performance d\'Investissement',
    originalAmount: 'Montant Original',
    trueValueToday: 'Valeur Réelle Aujourd\'hui',
    withInvestmentReturns: 'Avec Rendements d\'Investissement',
    realGrowthAfterInflation: 'Croissance Réelle Après Inflation',
    calculateButton: 'Calculer les Résultats',
    backToInvestments: 'Changer le type d\'investissement',
    moneyLostToInflation: 'Argent Perdu à Cause de l\'Inflation',
    changeInPurchasingPower: 'changement du pouvoir d\'achat',
    nominalGrowth: 'croissance nominale',
    realGrowth: 'croissance réelle'
  },
  feedback: {
    title: 'Aidez-nous à nous améliorer',
    emailLabel: 'Votre email (optionnel)',
    messageLabel: 'Vos commentaires',
    ratingLabel: 'Comment évalueriez-vous votre expérience ?',
    submitButton: 'Envoyer les Commentaires',
    placeholder: 'Dites-nous ce que vous pensez de la calculatrice...',
    thankYou: 'Merci pour vos commentaires !'
  },
  investmentTypes: {
    none: {
      name: 'Aucun Investissement',
      description: 'Voir l\'impact de l\'inflation uniquement, sans aucun rendement d\'investissement',
    },
    cash: {
      name: 'Liquidités/Épargne',
      description: 'Comptes d\'épargne à faible risque ou bons du Trésor à court terme avec volatilité minimale',
    },
    bonds: {
      name: 'Obligations d\'État',
      description: 'Obligations d\'État à 10 ans avec risque modéré et rendements généralement supérieurs aux liquidités',
    },
    stocks: {
      name: 'Marché Boursier',
      description: 'Indice boursier large représentant un risque plus élevé avec un potentiel de rendements à long terme plus élevés',
    },
    realEstate: {
      name: 'Immobilier',
      description: 'Indice des prix immobiliers résidentiels montrant la performance moyenne du marché immobilier',
    },
    custom: {
      name: 'Taux Personnalisé',
      description: 'Définissez votre propre taux de rendement annuel pour comparer des scénarios d\'investissement personnalisés',
    }
  },
  seo: {
    title: 'Calculateur d\'Investissement | Rendements Historiques et Impact de l\'Inflation',
    description: 'Calculez comment l\'inflation et les investissements affectent votre argent au fil du temps. Comparez actions, obligations, immobilier et plus basé sur des données historiques.',
    keywords: 'calculateur d\'investissement, calculateur d\'inflation, rendements d\'actions, rendements d\'obligations, investissement immobilier, rendements historiques, planification financière'
  }
};