export default async (policyContext: any, config: any, { strapi }: any) => {
  const user = policyContext.state.user;

  if (!user) return false;

  const { id } = policyContext.params;

  // Si pas d'ID (création), on autorise
  if (!id) return true;

  const signalement = await strapi.db.query('api::signalement.signalement').findOne({
    where: { id },
    select: ['id'],
    populate: ['user'],
  });

  return signalement?.user?.id === user.id;
};