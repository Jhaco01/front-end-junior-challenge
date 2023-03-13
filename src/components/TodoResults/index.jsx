import "./styles.css";
import { useSelector } from "react-redux";

const TodoResults = () => {

  //Hook to get the list of TODOs from the store
  const { todoList } = useSelector(state => state.todo)

  //This function will check wich of the item are  checked as completed and return the quantity (int)
  const calculateDoneTodoItems = () => {
    const checkedTodos = todoList.filter( item => item.checked === true )
    return checkedTodos.length
  }

  return <div className="todo-results">Done: { /* the quantity is render as done tasks */ calculateDoneTodoItems()}</div>;
};

export default TodoResults;