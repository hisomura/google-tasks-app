import { createApi, fakeBaseQuery } from "@rtk-incubator/rtk-query/react";
import { getTasklists, Tasklist } from "../lib/gapi-wrappers";

export const tasklistsApi = createApi({
  reducerPath: "tasklists",
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

export const { useGetTasklistsQuery } = tasklistsApi;
