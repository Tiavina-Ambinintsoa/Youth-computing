import jwt from 'jsonwebtoken';

export default {
  async me(ctx: any) {
    const authHeader = ctx.request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return ctx.unauthorized();

    const token = authHeader.slice(7);

    let decoded: any;
    try {
      const secret = process.env.JWT_SECRET as string;
      decoded = jwt.verify(token, secret);
    } catch (e) {
      return ctx.unauthorized();
    }

    const fullUser = await (strapi as any).db.query('plugin::users-permissions.user').findOne({
      where: { id: decoded.id },
      populate: { role: true },
    });

    if (!fullUser) return ctx.unauthorized();

    return {
      id: fullUser.id,
      documentId: fullUser.documentId,
      username: fullUser.username,
      email: fullUser.email,
      role: fullUser.role,
    };
  },
};
