import seedCategories from './categories';
import seedQuartiers from './quartiers';

export default async ({ strapi }: { strapi: any }) => {
  await seedCategories({ strapi });
  await seedQuartiers({ strapi });
};
