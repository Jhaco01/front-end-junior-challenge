//Style's import
import './styles.css'

//Hooks
import { useState } from "react"

//toast function from the selected toast library
import { toast } from 'react-toastify';

//Actions and hooks from rkt
import { useDispatch } from 'react-redux'
import { createTodoListItem } from 'features/todoSlice';

const TodoForm = () => {

    const dispatch = useDispatch();

    //Functions to manage the behavior of the input text
    //of the form component.

    const [todoForm, setTodoForm] = useState('')

    const handleChange = (e) => {
        const {value} = e.target;
        setTodoForm(value)
    }

    const handleClick = (e) => {
        e.preventDefault();

        //This verification is added so is
        //no possible to send empty data to API.
        if (!todoForm.trim()) return
        const label = todoForm

        const newTodo = {
            label: label,
            checked: false
        }

        const reducerArgs = {
            newTodo,
            toast
          }

        setTodoForm('')

        //The information is sent to the API to add a
        //new todo item and then updates the store.
        dispatch(createTodoListItem(reducerArgs))
    }

    return (
    <form className='todo-form' >
        <input
            className='todo-form-input'
            type="text"
            name="label"
            value={todoForm}
            onChange={handleChange}
            placeholder='Enter new to do'
        />
        <button className='todo-form-button' onClick={e => handleClick(e)} > ADD TO DO </button>
    </form>
  )
}

export default TodoForm;