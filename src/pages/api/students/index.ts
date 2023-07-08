import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { studentValidationSchema } from 'validationSchema/students';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStudents();
    case 'POST':
      return createStudent();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStudents() {
    const data = await prisma.student
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'student'));
    return res.status(200).json(data);
  }

  async function createStudent() {
    await studentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.parent_parent_student_idTostudent?.length > 0) {
      const create_parent_parent_student_idTostudent = body.parent_parent_student_idTostudent;
      body.parent_parent_student_idTostudent = {
        create: create_parent_parent_student_idTostudent,
      };
    } else {
      delete body.parent_parent_student_idTostudent;
    }
    const data = await prisma.student.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
