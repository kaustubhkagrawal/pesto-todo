import { Box, Container, SpeedDial, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { fetchAllTasks, fetchAllTasksQueryKeys } from '../../../logic';
import { CreateTaskSchema, Task } from '../../../shared';
import { BottomDrawer, TodoItems } from '../../../ui';
import { TodoForm } from '../components/TodoForm';
import { TASK_STATUS_ENUM } from '@pesto/shared';

const allTasksQueryKeys = fetchAllTasksQueryKeys();

enum TASK_FILTER_ENUM {
  ALL = 'all',
}

const defaultEditMode = {
  edit: false,
  id: '',
  initialValues: CreateTaskSchema.cast({}, { assert: false }),
};

export function Home() {
  const { data, isLoading } = useQuery({
    queryKey: allTasksQueryKeys,
    queryFn: fetchAllTasks,
    refetchOnWindowFocus: false,
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [editMode, setEditMode] = useState(defaultEditMode);

  const [filter, setFilter] = useState<TASK_STATUS_ENUM[]>(
    Object.values(TASK_STATUS_ENUM)
  );

  const editTask = (task: Task) => {
    setEditMode({
      edit: true,
      id: task.id,
      initialValues: CreateTaskSchema.cast(task, {
        assert: false,
        stripUnknown: false,
      }),
    });
    setIsEditorOpen(true);
  };

  const resetEditor = () => {
    setEditMode(defaultEditMode);
  };

  const onComplete = () => {
    setIsEditorOpen(false);
    resetEditor();
  };

  const onCloseHandler = () => {
    setIsEditorOpen(false);
    resetEditor();
  };

  const mainBody = (
    <Container maxWidth="md">
      <Stack>
        <Stack py={4} justifyContent={'center'} alignItems={'center'}>
          <Typography variant="h3" textTransform={'uppercase'}>
            To Do List
          </Typography>
          <Typography
            variant="caption"
            color={'gray'}
            textTransform={'uppercase'}
          >
            8 items pending
          </Typography>
        </Stack>
        <Stack>
          {!isLoading && data ? (
            <TodoItems data={data} editTask={editTask} />
          ) : (
            'Loading...'
          )}
        </Stack>
      </Stack>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: '48%' }}
        icon={<PiPlus size={30} />}
        onClick={() => {
          setIsEditorOpen(true);
        }}
      ></SpeedDial>

      <BottomDrawer
        isOpen={isEditorOpen}
        setIsOpen={setIsEditorOpen}
        onCloseHandler={onCloseHandler}
      >
        <TodoForm onComplete={onComplete} {...editMode} />
      </BottomDrawer>
    </Container>
  );

  return mainBody;
  // return <DefaultLayout>{mainBody}</DefaultLayout>;
}