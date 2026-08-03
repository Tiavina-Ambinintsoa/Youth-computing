/**
 * signalement controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::signalement.signalement', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const { data } = ctx.request.body;

    const entry = await strapi.entityService.create('api::signalement.signalement', {
      data: {
        ...data,
        ...(user ? { users_permissions_user: user.id } : {}),
      },
      populate: ['categorie', 'quartier', 'photos'],
    });

    return { data: entry, meta: {} };
  },

  async findMine(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();

    const signalements = await strapi.entityService.findMany('api::signalement.signalement', {
      filters: { users_permissions_user: { id: user.id } } as any,
      populate: ['categorie', 'quartier', 'photos'],
      sort: { createdAt: 'desc' },
    });

    return { data: signalements, meta: {} };
  },
}));
