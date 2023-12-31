import { green, grey, orange } from '@mui/material/colors';
import { TASK_STATUS_ENUM } from '@pesto/shared';

import {
  PiCheckCircleBold,
  PiCircleBold,
  PiPlayCircleFill,
} from 'react-icons/pi';

export const ENDPOINTS = {
  TODO: {
    LIST: '/todo-lists',
    ITEM: '/todo-items',
  },
};

export enum REST_METHODS_ENUM {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const TASK_STATUS_CONFIG = {
  [TASK_STATUS_ENUM.TODO]: {
    text: 'To Do',
    icon: PiCircleBold,
    type: 'TODO',
    color: grey[500],
    palette: 'secondary',
    next: TASK_STATUS_ENUM.IN_PROGRESS,
  },
  [TASK_STATUS_ENUM.IN_PROGRESS]: {
    text: 'In Progress',
    icon: PiPlayCircleFill,
    type: 'IN_PROGRESS',
    color: orange[500],
    palette: 'warning',
    next: TASK_STATUS_ENUM.DONE,
  },
  [TASK_STATUS_ENUM.DONE]: {
    text: 'Done',
    icon: PiCheckCircleBold,
    type: 'DONE',
    color: green[500],
    palette: 'success',
    next: TASK_STATUS_ENUM.DONE,
  },
};
