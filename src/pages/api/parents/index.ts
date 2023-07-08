import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { parentValidationSchema } from 'validationSchema/parents';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getParents();
    case 'POST':
      return createParent();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getParents() {
    const data = await prisma.parent
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'parent'));
    return res.status(200).json(data);
  }

  async function createParent() {
    await parentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.student_student_parent_idToparent?.length > 0) {
      const create_student_student_parent_idToparent = body.student_student_parent_idToparent;
      body.student_student_parent_idToparent = {
        create: create_student_student_parent_idToparent,
      };
    } else {
      delete body.student_student_parent_idToparent;
    }
    const data = await prisma.parent.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
