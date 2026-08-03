export default {
  routes: [
    {
      method: 'GET',
      path: '/profile/me',
      handler: 'api::profile.profile.me',
      config: { policies: [], middlewares: [], auth: false },
    },
  ],
};
