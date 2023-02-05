import {
  Card,
  Center,
  Stack,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { z, ZodError } from 'zod';

import { getServerAuthSession } from '../server/common/get-server-auth-session';
import { getInputPropsMiddleware } from '../tools/getInputPropsMiddleware';
import { IRegister, formRegisterSchema } from '../validation/auth';

const Register: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  registrationToken,
}) => {
  const router = useRouter();
  const { onSubmit, getInputProps } = useForm<Omit<IRegister, 'token'>>({
    validate: zodResolver(formRegisterSchema),
  });
  const { mutateAsync: registerAsync } = useMutation({
    mutationKey: ['user/register'],
    mutationFn: async (props: Omit<IRegister, 'token'>) => {
      const response = await axios.post('/api/auth/register', {
        ...props,
        token: registrationToken,
      });
      return response.data;
    },
    // eslint-disable-next-line consistent-return
    onError(
      error: AxiosError<
        | { code: 'BAD_REQUEST'; message: string; data: ZodError }
        | { code: 'CONFLICT'; message: string }
        | { code: 'FORBIDDEN'; message: string }
      >
    ) {
      const errorData = error.response?.data;
      if (errorData?.code === 'BAD_REQUEST') {
        return showNotification({
          title: 'Registration failed',
          message: 'Please provide valid registration information.',
          icon: <IconX />,
          color: 'red',
        });
      }
      if (errorData?.code === 'CONFLICT') {
        return showNotification({
          title: 'Registration failed',
          message: 'The provided username is already used.',
          icon: <IconX />,
          color: 'red',
        });
      }
      if (errorData?.code === 'FORBIDDEN') {
        return showNotification({
          title: 'Registration failed',
          message: 'The invationtoken expired.',
          icon: <IconX />,
          color: 'red',
        });
      }
    },
    onSuccess() {
      router.push('/login');
      return showNotification({
        title: 'Registration successful',
        message: 'Registration was successful, please login now.',
        icon: <IconCheck />,
        color: 'teal',
      });
    },
  });

  const handleSubmit = async (data: Omit<IRegister, 'token'>) => {
    try {
      // TODO: add endpoint for creation of registration
      //await sign('credentials', { ...data });
      await registerAsync(data);
    } catch (e) {
      /* empty */
    }
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center h="100vh">
        <Card p="lg" w="100%" maw="420px" withBorder>
          <form onSubmit={onSubmit(handleSubmit)}>
            <Stack>
              <Stack align="center">
                <Title>Create your account!</Title>
                <Text color="dimmed" size="sm">
                  Please choose an username and a secure password.
                </Text>
              </Stack>

              <TextInput
                {...getInputPropsMiddleware(getInputProps('username'))}
                withAsterisk
                label="Username"
              />
              <PasswordInput
                {...getInputPropsMiddleware(getInputProps('password'))}
                withAsterisk
                label="Password"
              />

              <Button fullWidth type="submit">
                Create account
              </Button>
              <Anchor color="dimmed" align="center" href="/login">
                Already have an account?
              </Anchor>
            </Stack>
          </form>
        </Card>
      </Center>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ registrationToken: string }> = async (
  context
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const result = await pageQuerySchema.safeParseAsync(context.query);
  if (!result.success) {
    return {
      notFound: true,
    };
  }

  const registrationToken = await prisma?.registrationToken.findFirst({
    where: {
      token: result.data.token,
    },
  });

  if (!registrationToken || registrationToken.expiresAt <= new Date()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      registrationToken: registrationToken.token,
    },
  };
};

const pageQuerySchema = z.object({
  token: z.string(),
});

export default Register;
