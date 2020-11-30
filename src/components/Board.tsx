import { FC, MouseEventHandler } from "react";
import { useQuery } from "react-query";
import TaskListContainer from "./TaskListContainer";

const signOutClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signOut();
};

const Board: FC = () => {
  const { isLoading, data } = useQuery("tasklists", () =>
    gapi.client.tasks.tasklists.list({ maxResults: 100 }).then((res) => res.result.items)
  );

  if (isLoading) return <>"Loading..."</>;

  return (
    <div>
      <button type="button" onClick={signOutClickHandler}>
        Sign out.
      </button>
      <div className="flex flex-wrap">
        {data?.map((taskList) => (
          <div key={taskList.id} className="">
            <TaskListContainer list={taskList}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
