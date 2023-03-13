//Style's import.
import "./styles.css";

//React component to be rendered to the UI when mapping the data in the store.
import TodoListItem from "components/TodoListItem";

//Toast component from the selected toast library
import { ToastContainer } from "react-toastify";

//Hooks and actions from redux toolkit.
import { deleteTodoListItem, updateTodoListItem } from "features/todoSlice";
import { useDispatch, useSelector } from "react-redux";

const TodoList = () => {

  const dispatch = useDispatch();

  //Function to be passed to each item of the todo list,
  //to provide the ability of be deleted from the store and
  //the API.
  const handleDelete = (todoId, label, toast) => {

    //To allow each thunk to work correctly, all
    //properties needed are wrapped in a single object.
    const reducerArgs = {
      id: todoId,
      label,
      toast
    }
    dispatch(deleteTodoListItem(reducerArgs))
  };

  //Function to be passed to each item of the todo list,
  //to provide the ability of change state from pending to
  //completed trought checked property both in the store and
  //the API.
  const toggleCheck = (todoId, isChecked, label, toast) => {

    //To allow each thunk to work correctly, all
    //properties needed are wrapped in a single object.
    const reducerArgs = {
      id: todoId,
      checked: isChecked,
      label,
      toast
    }
    dispatch(updateTodoListItem(reducerArgs));
  };

  //Selector to bring the list of TODOs to the component.
  const { todoList } = useSelector( state => state.todo )

  //Function to render all the TODOs from the store in
  //the UI throught the .map() function.
  const renderTodos = () => {
    return todoList.map( item => {

      //All the props are wrapped to be passed to the component.
      const itemProp = {
        //Function to update state.
        onCheck : toggleCheck,
        checked : item.checked,

        //Function to delete item
        onDelete : handleDelete,
        label : item.label,

        //id to identify the item.
        id: item.id
      }
      return <TodoListItem key={item.id} {...itemProp} />
    })
  }

  return (
    <div className="todo-list">
      <ToastContainer />
      <span className="todo-list-title">Things to do:</span>
      <div className="todo-list-content">
        { /* this is where all the TODO's are render */
         renderTodos() }
      </div>
      { /* in case there are no TODOs to be render, this message is shown */
      !todoList.length && <div className="no-todos">
        Looks like you&apos;re absolutely free today!
      </div> }
    </div>
  );
};

export default TodoList;
