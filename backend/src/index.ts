import seedData from './seeds';

export default {
  register({ strapi }: { strapi: any }) {},

  async bootstrap({ strapi }: { strapi: any }) {
    await seedData({ strapi });

    const callbackController = strapi
      .plugin('users-permissions')
      .controller('auth');

    const originalCallback = callbackController.callback.bind(callbackController);

    callbackController.callback = async (ctx: any) => {
      await originalCallback(ctx);
      if (ctx.body?.user) {
        const user = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          ctx.body.user.id,
          { populate: ['role'] }
        );
        ctx.body.user = user;
      }
    };
  },
};
