import { createApi, fakeBaseQuery } from "@rtk-incubator/rtk-query/react";
import { getTasklists, getTasks, Task, Tasklist } from "../lib/gapi-wrappers";

export const tasklistsApi = createApi({
  reducerPath: "tasklistsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getTasklists: build.query<Tasklist[], void>({
      async queryFn() {
        const tasklists = await getTasklists();
        return { data: tasklists };
      },
    }),
  }),
});

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getTasks: build.query<Task[], string>({
      async queryFn(id) {
        const tasks = await getTasks(id);
        return { data: tasks };
      },
    }),
  }),
});

export const { useGetTasklistsQuery } = tasklistsApi;
export const { useGetTasksQuery } = tasksApi;
