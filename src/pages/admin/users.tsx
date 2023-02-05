import { Badge, Button, Container, Group, Menu, Stack, TextInput, Title } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { User } from '@prisma/client';
import { IconChevronDown, IconMail, IconSearch } from '@tabler/icons';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { openInviteCreateModal } from '../../components/Admin/Invite/InviteCreateModal';
import { UserTable } from '../../components/Admin/User/UserTable';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { getServerSideTranslations } from '../../tools/getServerSideTranslations';

type GetUsersResponse = (Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'isAdmin'> & {
  role: 'admin' | 'user';
})[];

const Users: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Stack>
          <div>
            <Title>Users</Title>
            <Title order={4} weight={400}>
              Manage the users that can access your dashboards.
            </Title>
          </div>
          <Group position="apart" noWrap>
            <Group spacing={0} w="100%" noWrap>
              <Menu>
                <Menu.Target>
                  <Button
                    variant="default"
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderRight: 'none',
                    }}
                    rightIcon={<IconChevronDown size={16} />}
                  >
                    Filters
                  </Button>
                </Menu.Target>
              </Menu>
              <TextInput
                icon={<IconSearch size={16} />}
                styles={{
                  input: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
                w="100%"
                placeholder="Search all users"
              />
            </Group>
            <Group noWrap>
              <Button
                component={NextLink}
                href="/admin/invites"
                variant="default"
                leftIcon={<IconMail size={16} />}
                rightIcon={<Badge>59</Badge>}
              >
                Invites
              </Button>
              <Button onClick={openInviteCreateModal}>Invite user</Button>
            </Group>
          </Group>
          <UserTable />
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  const currentUser = await prisma?.user.findFirst({
    where: {
      id: session?.user?.id,
    },
  });

  if (!currentUser?.isAdmin) {
    return {
      notFound: true,
    };
  }

  const translations = await getServerSideTranslations(
    context.req,
    context.res,
    ['common', 'form'],
    context.locale
  );

  return { props: { ...translations } };
};

export default Users;
