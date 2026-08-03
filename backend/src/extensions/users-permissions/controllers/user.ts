module.exports = (plugin: any) => {
  const originalMe = plugin.controllers.user.me;

  plugin.controllers.user.me = async (ctx: any) => {
    await originalMe(ctx);
    if (ctx.state.user) {
      const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        ctx.state.user.id,
        { populate: ['role'] }
      );
      ctx.body = user;
    }
  };

  return plugin;
};
