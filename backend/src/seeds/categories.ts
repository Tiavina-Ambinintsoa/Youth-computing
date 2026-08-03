const categories = [
  {
    nom: 'Voirie & Routes',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Nids de poule, routes dégradées, trottoirs endommagés.' }] }],
    couleur: '#EF4444',
    icone: 'road',
  },
  {
    nom: 'Éclairage public',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Lampadaires en panne, zones mal éclairées.' }] }],
    couleur: '#F59E0B',
    icone: 'lightbulb',
  },
  {
    nom: 'Déchets & Propreté',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Dépôts sauvages, poubelles débordantes, déchets dans les rues.' }] }],
    couleur: '#10B981',
    icone: 'trash',
  },
  {
    nom: 'Eau & Assainissement',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Fuites d\'eau, canalisations bouchées, inondations.' }] }],
    couleur: '#3B82F6',
    icone: 'droplet',
  },
  {
    nom: 'Espaces verts',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Parcs dégradés, arbres dangereux, végétation envahissante.' }] }],
    couleur: '#22C55E',
    icone: 'tree',
  },
  {
    nom: 'Bâtiments publics',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Dégradations d\'écoles, marchés, bâtiments administratifs.' }] }],
    couleur: '#8B5CF6',
    icone: 'building',
  },
  {
    nom: 'Sécurité & Danger',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Zones dangereuses, accidents, risques pour les citoyens.' }] }],
    couleur: '#DC2626',
    icone: 'shield-alert',
  },
  {
    nom: 'Transport & Mobilité',
    description: [{ type: 'paragraph', children: [{ type: 'text', text: 'Arrêts de bus dégradés, signalisation manquante, stationnement illégal.' }] }],
    couleur: '#0EA5E9',
    icone: 'bus',
  },
];

async function seed({ strapi }: { strapi: any }) {
  for (const cat of categories) {
    const existing = await strapi.db.query('api::categorie.categorie').findOne({
      where: { nom: cat.nom },
    });
    if (!existing) {
      await strapi.db.query('api::categorie.categorie').create({
        data: { ...cat, publishedAt: new Date() },
      });
      console.log(`✅ Catégorie créée : ${cat.nom}`);
    } else {
      console.log(`⏭️  Déjà existante : ${cat.nom}`);
    }
  }
}

export default seed;
