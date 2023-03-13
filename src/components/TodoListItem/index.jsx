import "./styles.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TodoListItem = ({ onCheck, checked, onDelete, label, id }) => (
  <div className="todo-list-item">
    <div
      tabIndex="0"
      role="checkbox"
      aria-checked
      className="todo-list-item-content"
    >
      <input
        tabIndex="-1"
        type="checkbox"
        checked={checked}
        onChange={() => /* this is the toggleCheck function */ onCheck(id,checked,label,toast)}
      />
      <span className={checked ? "todo-list-item-checked" : ""}>{label}</span>
    </div>
    <button type="button" className="todo-list-item-delete" onClick={() => /* this is the handleDelete function */ onDelete(id,label,toast)}>
      x
    </button>
  </div>
);

export default TodoListItem;
