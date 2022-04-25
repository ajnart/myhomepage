import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Group, Text, Image, Anchor, Box, AspectRatio, createStyles } from '@mantine/core';
import { serviceItem } from './AppShelf.d';
import AppShelfMenu from './AppShelfMenu';
import AddItemShelfItem from './AddAppShelfItem';

const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    textAlign: 'center',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },
  },
}));

const AppShelf = () => {
  const [services, setServices] = useState<serviceItem[]>([]);
  const { classes } = useStyles();
  const [hovering, setHovering] = useState('none');

  useEffect(() => {
    const localServices: serviceItem[] = JSON.parse(localStorage.getItem('services') || '[]');
    if (localServices) {
      setServices(localServices);
    }
  }, []);

  function addItem(item: serviceItem) {
    setServices([...services, item]);
    localStorage.setItem('services', JSON.stringify([...services, item]));
  }

  function removeItem(item: serviceItem) {
    setServices(services.filter((s) => s.url !== item.url));
    localStorage.setItem('services', JSON.stringify(services.filter((s) => s.url !== item.url)));
  }

  return (
    <Grid m={'xl'} gutter={'xl'}>
      {services.map((service, i) => (
        <Grid.Col lg={2} sm={3} key={i}>
          <motion.div
            onHoverStart={(e) => {
              setHovering(service.name);
            }}
            onHoverEnd={(e) => {
              setHovering('none');
            }}
          >
            <AspectRatio ratio={4 / 3}>
              <Box className={classes.main}>
                <motion.div animate={{ opacity: hovering == service.name ? 1 : 0 }}>
                  <AppShelfMenu removeitem={removeItem} name={service.name} />
                </motion.div>
                <Group direction="column" position="center">
                  <Anchor href={service.url} target="_blank">
                    <motion.div whileHover={{ scale: 1.2 }}>
                      <Image style={{ maxWidth: 60 }} src={service.icon} alt={service.name} />
                    </motion.div>
                  </Anchor>
                  <Text>{service.name}</Text>
                </Group>
              </Box>
            </AspectRatio>
          </motion.div>
        </Grid.Col>
      ))}
      <AddItemShelfItem additem={addItem} />
    </Grid>
  );
};

export default AppShelf;

const MockServices = [
  {
    name: 'Radarr',
    type: 'Radarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Radarr/icon.png',
    url: 'http://server:7878/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
  {
    name: 'Sonarr',
    type: 'Sonarr',
    icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Sonarr/icon.png',
    url: 'http://server:8989/',
  },
];

function saveLocal(arg0: any) {
  // localStorage.setItem('services', JSON.stringify(arg0));
  console.log(`saving ${arg0}`);
}

function loadLocal(arg0: string) {
  const local = localStorage.getItem(arg0);
  if (local) {
    return JSON.parse(local);
  }
  return [
    ...MockServices,
    {
      name: 'Radarr',
      type: 'Radarr',
      icon: 'https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Radarr/icon.png',
      url: 'http://server:7878/',
    },
  ];
}
