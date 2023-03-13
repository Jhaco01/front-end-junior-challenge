//Style's import.
import "./App.css";

//Component's import
import TodoList from "./components/TodoList";
import TodoResults from "./components/TodoResults";
import TodoForm from "components/TodoForm";

//Hooks
import { useEffect } from "react";

//the toast action from the selected toast library.
import { toast } from "react-toastify";

//Actions and hooks from redux toolkit.
import { getTodoList } from "features/todoSlice";
import { useDispatch } from "react-redux";

const App = () => {


  const dispatch = useDispatch();

  //This hook is in charge of call the API and
  //provides the data needed for the app functionallities.
  useEffect(() => {
    dispatch(getTodoList(toast));
  },[])

  return (
    <div className="root">
      {/* Custom react components */}
      <TodoList />
      <TodoResults />
      <TodoForm />
    </div>
  );
};

export default App;
