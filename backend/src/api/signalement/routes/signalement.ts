/**
 * signalement router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/signalements/me',
      handler: 'signalement.findMine',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/signalements',
      handler: 'signalement.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/signalements/:id',
      handler: 'signalement.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/signalements',
      handler: 'signalement.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/signalements/:id',
      handler: 'signalement.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/signalements/:id',
      handler: 'signalement.delete',
      config: { policies: [] },
    },
  ],
};
