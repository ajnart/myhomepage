import { randomBytes } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerAuthSession } from '../../../../server/common/get-server-auth-session';

const Post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  const user = await prisma?.user.findFirst({
    where: { id: session?.user?.id },
  });

  if (!user?.isAdmin) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'User does not have enough privileges.',
    });
  }

  const result = await registrationTokenCreationSchema.safeParseAsync(req.body);
  if (!result.success) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid body input.',
      data: result.error,
    });
  }

  // Generates token for registration
  const token = randomBytes(48).toString('hex');

  // Generates expiration date (7 days from now)
  const currentDate = new Date().getDate();
  const expirationDate = new Date();
  expirationDate.setDate(currentDate + 7);

  const registrationToken = await prisma?.registrationToken.create({
    data: {
      name: result.data.name,
      token,
      expiresAt: expirationDate,
    },
  });

  res.status(200).json(registrationToken);
};

const registrationTokenCreationSchema = z.object({
  name: z.string().min(4).max(64),
});

const Get = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  const user = await prisma?.user.findFirst({
    where: { id: session?.user?.id },
  });

  if (!user?.isAdmin) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'User does not have enough privileges.',
    });
  }

  const tokens = await prisma?.registrationToken.findMany();

  // !!! NEVER ADD THE TOKEN TO THE RESPONSE !!!
  res.status(200).json(
    tokens?.map((token) => ({
      id: token.id,
      name: token.name,
      expiresAt: token.expiresAt,
    }))
  );
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return Post(req, res);
  }

  if (req.method === 'GET') {
    return Get(req, res);
  }

  return res.status(405).json({
    statusCode: 405,
    message: 'Method not allowed',
  });
};
