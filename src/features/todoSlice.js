import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const url = 'https://my-json-server.typicode.com/AlvaroArratia/static-todos-api/todos/';

//Redux Thunk to get the data from API, this will be rendered in the UI. In case of an error from
//server, a toast recieved from the thunk's function call will be shown to the user with the information.
//This function has to be called in the first render of the web application.
export const getTodoList = createAsyncThunk('todo/getTodoList', async (toast, {rejectWithValue}) => {

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    try {

      const resp = await fetch(url, requestOptions);
      if (!resp.ok) {
        throw new Error('Something went wrong');
      } else {
        const data = await resp.json();
        return data
      }

    } catch (error) {

      //Toast is received from the call and is displayed with the error information.
      toast.error("Something went wrong while getting your TODOs, please try again in a few minutes");
      return rejectWithValue(error.message)

    }

})

//Thunk to create a new item in the TODO list by posting data to the API and then, if successfull, adding to the store. In other case, a toast received
//from the thunk's function call will shown information of the error to the user.
export const createTodoListItem = createAsyncThunk('todo/createTodoListItem', async ({newTodo, toast}, {getState, rejectWithValue}) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //The information of the new item is also received from the call as a
    //javascript object with the task info as 'label' property and 'checked'
    //property as a default 'false' boolean property.
    const raw = JSON.stringify(newTodo);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {

      const resp = await fetch(url, requestOptions);
      if (!resp.ok) {
        throw new Error('Something went wrong');
      } else {
        const data = await resp.json();

        //Due to the API is readonly, it will receive the information and will accept the
        //POST request, but all new items added will have same id, so a quick fix that won't
        //be needed in a normal API, is to take the id of the last item in the list and adding 1
        //to the new id of the new item. Always after 6 because, if less than 6, API will return
        //one of the 6 default items, due to its readonly behavior.
        const { todo } = getState();
        const { todoList } = todo;

        //if there is any item in the list, its id will be taken as a parameter to
        //the id of the new item, in other case, 6 is the id to assign.
        const id = todoList.length ? todoList[todoList.length - 1].id + 1 : 6;

        //If the result id is minor than 6, 6 will be assigned.
        const fixedId = id < 6 ? 6 : id;

        //Then the new item is rewritten in the store, with a fix id.
        return {
          ...data,
          id: fixedId
        }

      }

    } catch (error) {

      //Toast is received from the call and is displayed with the error information.
      toast.error('Something went wrong while creating the new TODO, please try again in a few minutes.')
      return rejectWithValue(error.message)

    }

})

//Thunk to update values in the TODO item selected. In the current application, only can update the 'checked' property. ALl of the properties
//of the selected TODO are needed as arguments when called, due to all of them have their own application cases. Also receive a toast in the
//same condition of the previous thunks.
export const updateTodoListItem = createAsyncThunk('todo/updateTodoListItem', async ({id, checked, label, toast}, {rejectWithValue}) => {

    try {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //The 'checked' property is received as it currently is,
        //and the function turned to opposite value.
        const raw = JSON.stringify({
            "checked": !checked
        });

        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const resp = await fetch(`${url}${id}`, requestOptions);

        if (!resp.ok) {
          throw new Error('Something went wrong');
        } else {
          const data = await resp.json();
          return data
        }

    } catch (error) {

        //Since is a readonly API, all the calls for not default items will return this toast.
        toast.error(`Sorry, this functionallity is not available for the TODO: ${label}`);
        return rejectWithValue(error.message)

    }

})

//Thunk to delete the TODO item selected. 'id' and 'label' properties are needed.
//Also receive a toast in the same condition of the previous thunks.
export const deleteTodoListItem = createAsyncThunk('todo/deleteTodoListItem', async ({id, label, toast},{rejectWithValue}) => {

    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    try {

        const resp = await fetch(`${url}${id}`, requestOptions);

        if (!resp.ok) {

          throw new Error('Something went wrong');

        } else {

          //Due to the response of this call after API delete the item
          //is an empty object, the id passed as argument will be needed to update
          //the store, deleting the item that has that id.
          const data = await resp.json();

          //That is why id is readded to the response.
          return {
              ...data,
              id
          }

        }

    } catch (error) {

      //Since is a readonly API, all the calls for not default items will return this toast.
      toast.error(`Sorry, this functionallity is not available for the TODO: ${label}`);
      return rejectWithValue(error.message)

    }

})

//The initial state is an empty array that will be updated with the getTodoList thunk after being successfull.
const initialState = {
    todoList: []
}

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {

    },
    extraReducers: (builder) =>{
        builder
          .addCase(getTodoList.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(getTodoList.fulfilled, (state, action) => {
            state.isLoading = false;
            //The store updates the todoList array with the data received from the API.
            state.todoList = action.payload;
          })
          .addCase(getTodoList.rejected, (state) => {
            state.isLoading = false;
          })
          .addCase(createTodoListItem.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(createTodoListItem.fulfilled, (state, action) => {
            state.isLoading = false;
            //After being added in the API, new item is added to the store too.
            state.todoList = [...state.todoList,action.payload]
          })
          .addCase(createTodoListItem.rejected, (state) => {
            state.isLoading = false;
          })
          .addCase(updateTodoListItem.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(updateTodoListItem.fulfilled, (state, action) => {
            state.isLoading = false;
            //The selected item is updated in the store with the values returned from the API
            state.todoList = state.todoList.map( item => item.id === action.payload.id ? action.payload : item )
          })
          .addCase(updateTodoListItem.rejected, (state) => {
            state.isLoading = false;
          })
          .addCase(deleteTodoListItem.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(deleteTodoListItem.fulfilled, (state, action) => {
            state.isLoading = false;
            //Item deleted in the API is also removed from the store.
            state.todoList = state.todoList.filter( item => item.id !== action.payload.id )
          })
          .addCase(deleteTodoListItem.rejected, (state) => {
            state.isLoading = false;
          });
    }
})

export default todoSlice.reducer;