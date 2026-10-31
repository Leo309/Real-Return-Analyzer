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
    calculateButton: 'Calculer',
    backToInvestments: 'Changer le type d\'investissement',
    moneyLostToInflation: 'Argent Perdu à Cause de l\'Inflation',
    changeInPurchasingPower: 'changement du pouvoir d\'achat',
    nominalGrowth: 'croissance nominale',
    realGrowth: 'croissance réelle',
    customRate: 'Taux de Rendement Annuel Personnalisé (%)',
    customRateHint: 'Entrez le taux de rendement annuel attendu pour votre investissement personnalisé',
    results: 'Résultats',
    inflationReducedPurchasingPower: 'Même avec l\'investissement, l\'inflation a réduit votre pouvoir d\'achat de {percentage}%'
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
      name: 'Compte d\'épargne',
      description: 'Comptes d\'épargne à faible risque ou dépôts à terme avec volatilité minimale',
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
  landing: {
    hero: {
      badge: 'Analyseur de Rendement Réel',
      titleStart: 'Avez-vous fait un',
      titleHighlight: 'choix judicieux',
      titleEnd: 'en investissement ?',
      subtitle: 'Découvrez comment l\'inflation dévore silencieusement votre argent — et ce que vous pouvez faire. Basé sur des données historiques réelles de 7 économies majeures.',
      cta: 'Commencer l\'Analyse',
      learnMore: 'En Savoir Plus',
      trustBadge1: 'Gratuit et Open Source',
      trustBadge2: '7 Pays Couverts',
    },
    features: {
      title: 'Ce Que Vous Pouvez Découvrir',
      subtitle: 'Comprenez l\'impact réel de l\'inflation sur votre patrimoine et comment les différents investissements se comparent.',
      purchasingPower: {
        title: 'Pouvoir d\'Achat Réel',
        description: 'Voyez exactement combien votre argent peut réellement acheter après des années d\'inflation. Les résultats pourraient vous surprendre.',
      },
      compare: {
        title: 'Comparer les Investissements',
        description: 'Actions, obligations, immobilier, comptes d\'épargne — voyez comment chacun aurait performé côte à côte.',
      },
      economies: {
        title: '7 Économies Majeures',
        description: 'Données historiques réelles des États-Unis, Canada, Royaume-Uni, Allemagne, Japon, Chine et Australie depuis 1970.',
      },
    },
    howItWorks: {
      title: 'Comment Ça Marche',
      step1: {
        title: 'Choisissez Votre Région',
        description: 'Choisissez parmi 7 pays avec des données économiques historiques réelles.',
      },
      step2: {
        title: 'Sélectionnez le Type d\'Investissement',
        description: 'Comparez espèces, obligations, actions, immobilier, ou définissez des taux personnalisés.',
      },
      step3: {
        title: 'Voyez les Résultats Réels',
        description: 'Des graphiques interactifs montrant le vrai pouvoir d\'achat de votre argent au fil du temps.',
      },
    },
    trust: {
      text: 'Construit avec des sources de données gouvernementales réelles — banques centrales, indices boursiers et données immobilières — couvrant 1970 à aujourd\'hui.',
    },
    bottomCta: {
      title: 'Prêt à découvrir la vérité sur votre argent ?',
      subtitle: 'Cela prend 30 secondes. Aucune inscription requise.',
      cta: 'Essayer le Calculateur',
    },
  },
  seo: {
    title: 'Calculateur d\'Investissement | Rendements Historiques et Impact de l\'Inflation',
    description: 'Calculez comment l\'inflation et les investissements affectent votre argent au fil du temps. Comparez actions, obligations, immobilier et plus basé sur des données historiques.',
    keywords: 'calculateur d\'investissement, calculateur d\'inflation, rendements d\'actions, rendements d\'obligations, investissement immobilier, rendements historiques, planification financière'
  }
};