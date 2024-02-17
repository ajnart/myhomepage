import { Center, Group, ScrollArea, Table, Text, Title, Tooltip } from '@mantine/core';
import { IconHeartbeat, IconTransform } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { TdarrQueue } from '~/server/api/routers/tdarr';
import { humanFileSize } from '~/tools/humanFileSize';
import { WidgetLoading } from '~/widgets/loading';
import { Filename } from '~/widgets/tdarr/Filename';

interface QueuePanelProps {
  queue: TdarrQueue | undefined;
  isLoading: boolean;
}

export function QueuePanel(props: QueuePanelProps) {
  const { queue, isLoading } = props;

  const { t } = useTranslation('modules/tdarr-queue');

  if (isLoading) {
    return <WidgetLoading />;
  }

  if (!queue?.array.length) {
    return (
      <Center
        style={{ flex: '1' }}
      >
        <Title order={3}>{t('views.queue.table.empty')}</Title>
      </Center>
    );
  }

  return (
    <ScrollArea style={{ flex: '1' }}>
      <Table style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>{t('views.queue.table.header.name')}</th>
            <th style={{ width: 80 }}>{t('views.queue.table.header.size')}</th>
          </tr>
        </thead>
        <tbody>
          {queue.array.map((item) => (
            <tr key={item.id}>
              <td>
                <Group spacing="xs" noWrap>
                  <div>
                    {item.type === 'transcode' ? (
                      <Tooltip label={t('views.workers.table.tooltip.transcode')}>
                        <IconTransform size={14} />
                      </Tooltip>
                    ) : (
                      <Tooltip label={t('views.workers.table.tooltip.healthCheck')}>
                        <IconHeartbeat size={14} />
                      </Tooltip>
                    )}
                  </div>
                  <Filename filename={item.file} />
                </Group>
              </td>
              <td>
                <Text size="xs">{humanFileSize(item.fileSize)}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
