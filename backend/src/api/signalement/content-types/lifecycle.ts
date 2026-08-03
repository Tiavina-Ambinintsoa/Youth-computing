export default {
    async beforeCreate(event: any) {
        const { data } = event.params;

        // Forcer le statut par défaut
        if (!data.statut) {
            data.statut = 'en_attente';
        }

        const hasCategorie = data.categorie?.connect?.length > 0;
        data.score_priorite = Math.min(Math.max(hasCategorie ? 80 : 50, 10), 100);
    },

    async beforeUpdate(event: any) {
        const { data } = event.params;

        if (data.categorie || data.description) {
            const hasCategorie = data.categorie?.connect?.length > 0 || !!data.categorie;
            data.score_priorite = Math.min(Math.max(hasCategorie ? 80 : 50, 10), 100);
        }
    },
};