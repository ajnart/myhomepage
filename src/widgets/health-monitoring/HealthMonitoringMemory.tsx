import { Center, Group, HoverCard, RingProgress, Text } from '@mantine/core';
import { IconBrain } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const HealthMonitoringMemory = ({ info }: any) => {
  const { t } = useTranslation('modules/health-monitoring');
  const totalMemoryGB: any = (info.memTotal / 1024 ** 3).toFixed(2);
  const freeMemoryGB: any = (info.memAvailable / 1024 ** 3).toFixed(2);
  const usedMemoryGB: any = ((info.memTotal - info.memAvailable) / 1024 ** 3).toFixed(2);
  const percentageUsed: any = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(2);
  const percentageFree: any = (100 - percentageUsed).toFixed(2);

  return (
    <Group position="center">
      <RingProgress
        roundCaps
        size={140}
        thickness={12}
        label={
          <Center style={{ flexDirection: 'column' }}>
            {usedMemoryGB}GiB
            <HoverCard width={280} shadow="md" position="top">
              <HoverCard.Target>
                <IconBrain size={40} />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text fz="lg" tt="uppercase" fw={700} c="dimmed" align="center">
                  {t('info.totalMem')}: {totalMemoryGB}GB
                </Text>
                <Text fz="lg" fw={500} align="center">
                  {t('info.available')}: {freeMemoryGB}GB - {percentageFree}%
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Center>
        }
        sections={[
          {
            value: percentageUsed,
            color:
              percentageUsed < 10
                ? 'green'
                : percentageUsed > 10 && percentageUsed < 70
                  ? 'yellow'
                  : percentageUsed > 70 && percentageUsed < 90
                    ? 'orange'
                    : 'red',
          },
        ]}
      />
    </Group>
  );
};

export default HealthMonitoringMemory;
