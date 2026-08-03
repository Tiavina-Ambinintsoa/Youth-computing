const quartiers = [
  { nom: 'Ambalapaiso I', population: 8500 },
  { nom: 'Ambalapaiso II', population: 7200 },
  { nom: 'Ambohimandroso', population: 6800 },
  { nom: 'Andrefan\'Ambohijanahary', population: 5400 },
  { nom: 'Ankofafa', population: 4900 },
  { nom: 'Bongatsara', population: 6100 },
  { nom: 'Faravohitra', population: 7800 },
  { nom: 'Haute-Ville', population: 9200 },
  { nom: 'Isaha', population: 5600 },
  { nom: 'Kianjasoa', population: 4300 },
  { nom: 'Laniera', population: 5100 },
  { nom: 'Mahamasina', population: 6700 },
  { nom: 'Maharidaza', population: 4800 },
  { nom: 'Namialy', population: 5900 },
  { nom: 'Sahambavy', population: 3800 },
  { nom: 'Tanambao', population: 7400 },
  { nom: 'Tsianolondroa', population: 4200 },
  { nom: 'Vohitsaoka', population: 5300 },
  { nom: 'Ambohipo', population: 6000 },
  { nom: 'Ampasanimalo', population: 4600 },
];

async function seed({ strapi }: { strapi: any }) {
  for (const quartier of quartiers) {
    const existing = await strapi.db.query('api::quartier.quartier').findOne({
      where: { nom: quartier.nom },
    });
    if (!existing) {
      await strapi.db.query('api::quartier.quartier').create({
        data: { ...quartier, publishedAt: new Date() },
      });
      console.log(`✅ Quartier créé : ${quartier.nom}`);
    } else {
      console.log(`⏭️  Déjà existant : ${quartier.nom}`);
    }
  }
}

export default seed;
