import { Button, Container, SpeedDial, Stack, Typography } from '@mui/material';
import { TASK_STATUS_ENUM } from '@pesto/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PiPlus } from 'react-icons/pi';
import { fetchAllTasks, fetchAllTasksQueryKeys } from '../../../logic';
import { CreateTaskSchema, TASK_STATUS_CONFIG, Task } from '../../../shared';
import { BottomDrawer, TodoItems } from '../../../ui';
import { TodoForm } from '../components/TodoForm';

const allTasksQueryKeys = fetchAllTasksQueryKeys();

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

  const [statusFilters, setStatusFilters] = useState<TASK_STATUS_ENUM[]>([
    TASK_STATUS_ENUM.TODO,
    TASK_STATUS_ENUM.IN_PROGRESS,
  ]);

  const filterByAllStatus = () => {
    if (statusFilters.length > 0) {
      setStatusFilters([]);
    } else {
      setStatusFilters([TASK_STATUS_ENUM.TODO, TASK_STATUS_ENUM.IN_PROGRESS]);
    }
  };

  const filterByStatus = (status: TASK_STATUS_ENUM) => {
    const idx = statusFilters.indexOf(status);
    if (idx > -1) {
      setStatusFilters((filters) => {
        const draft = [...filters];
        draft.splice(idx, 1);
        return draft;
      });
    } else {
      setStatusFilters((filters) => [...filters, status]);
    }
  };

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

  const numCompleted = data
    ? data.reduce(
        (numCompleted, task) =>
          (numCompleted +=
            TASK_STATUS_CONFIG[task.status as TASK_STATUS_ENUM].type === 'DONE'
              ? 1
              : 0),
        0
      )
    : 0;

  const filteredData = data
    ? data.filter(
        (data) =>
          statusFilters.length === 0 ||
          statusFilters.includes(data.status as TASK_STATUS_ENUM)
      )
    : [];

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
            {numCompleted}/{data?.length} tasks completed
          </Typography>
          <Stack spacing={1} py={2} direction={'row'}>
            <Button
              size={'small'}
              disableElevation
              sx={{ minWidth: '4em', fontSize: '0.7em' }}
              color="success"
              variant={statusFilters.length === 0 ? 'contained' : 'outlined'}
              onClick={() => filterByAllStatus()}
            >
              All
            </Button>
            {Object.values(TASK_STATUS_ENUM).map((status) => {
              const config = TASK_STATUS_CONFIG[status];
              return (
                <Button
                  size={'small'}
                  onClick={() => filterByStatus(status)}
                  disableElevation
                  color={config.pallete}
                  variant={
                    statusFilters.includes(status) ? 'contained' : 'outlined'
                  }
                  startIcon={<config.icon color={config.color} />}
                  sx={{
                    minWidth: '4em',
                    fontSize: '0.7em',
                  }}
                >
                  {config.text}
                </Button>
              );
            })}
          </Stack>
        </Stack>
        <Stack pb={10}>
          {!isLoading && filteredData ? (
            <TodoItems data={filteredData} editTask={editTask} />
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
