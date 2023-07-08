import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { parentValidationSchema } from 'validationSchema/parents';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.parent
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getParentById();
    case 'PUT':
      return updateParentById();
    case 'DELETE':
      return deleteParentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getParentById() {
    const data = await prisma.parent.findFirst(convertQueryToPrismaUtil(req.query, 'parent'));
    return res.status(200).json(data);
  }

  async function updateParentById() {
    await parentValidationSchema.validate(req.body);
    const data = await prisma.parent.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteParentById() {
    const data = await prisma.parent.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
