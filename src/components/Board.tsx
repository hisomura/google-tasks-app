import { FC } from "react";
import { useQuery } from "react-query";
import TaskListContainer from "./TaskListContainer";
import { getTasklists, signOut } from "../lib/gapi-wrappers";
import { removeAllTaskIds } from "../store/selectedTaskIdsSlice";
import { useDispatch } from "react-redux";

const Board: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, data } = useQuery("tasklists", getTasklists);

  if (isLoading) return <>"Loading..."</>;

  return (
    <div
      onClick={() => dispatch(removeAllTaskIds({}))}
      onMouseMove={(e) => {
        if (Date.now() % 10 === 0) {
          console.log(e.clientX, e.clientY);
        }
      }}
    >
      <button type="button" onClick={signOut} className="m-8 border">
        Sign out.
      </button>
      <div className="flex flex-wrap">
        {data?.map((taskList) => (
          <div key={taskList.id} className="">
            <TaskListContainer tasklist={taskList} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
