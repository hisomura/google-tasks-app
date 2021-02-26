import { FC } from "react";
import { useQuery } from "react-query";
import TasklistContainer from "./TasklistContainer";
import { getTasklists, signOut } from "../lib/gapi-wrappers";
import { removeAllTaskIds } from "../store/selectedTaskIdsSlice";
import { useDispatch } from "react-redux";

const Board: FC = () => {
  const dispatch = useDispatch();
  const { isLoading, data } = useQuery("tasklists", getTasklists);

  if (isLoading) return <>"Loading..."</>;

  return (
    <div onClick={() => dispatch(removeAllTaskIds({}))} draggable={false} className="select-none">
      <button type="button" onClick={signOut} className="m-8 border select-none">
        Sign out.
      </button>
      <div className="flex flex-wrap">
        {data?.map((tasklist) => (
          <div key={tasklist.id} className="">
            <TasklistContainer tasklist={tasklist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
