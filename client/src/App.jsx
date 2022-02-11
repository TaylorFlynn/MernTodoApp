import { useEffect, useRef, useState } from 'react';
const api_base = 'https://mern-checklist.herokuapp.com';

function App() {
	const [todos, setTodos] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");
	const InputRef = useRef(null)

	useEffect(() => {
		GetTodos();
	}, []);


	const GetTodos = () => {
		fetch(api_base + '/todos')
			.then(res => res.json())
			.then(data => setTodos(data))
			.catch((err) => console.error("Error: ", err));
	}

	const completeTodo = async id => {
      const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());
      setTodos(todos => todos.map(todo => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      }));
	}

	const addTodo = async () => {
		const data = await fetch(api_base + "/todo/new", {method: "POST", headers: {"Content-Type": "application/json" },
		body: JSON.stringify({
			text: newTodo
		})
		}).then(res => res.json());

		setTodos([...todos, data]);
		setNewTodo("");
		setPopupActive(prevPopupActive => !prevPopupActive)
	}

	const deleteTodo = async id => {
    await fetch(api_base + '/todo/' + id, { method: "DELETE" }).then(res => res.json());
    GetTodos()
	}


	return (
		<div className="App">
			<h1>Welcome Stranger</h1>
			<h4>Your tasks</h4>
			<div className="todos">
				{todos.length > 0 ? todos.map(todo => (
					<div className={
						"todo" + (todo.complete ? " is-complete" : "")
					} key={todo._id}>
						<div className="todoContainer" onClick={() => completeTodo(todo._id)}>
							<div className="checkbox"></div>
							<div className="text">{todo.text}</div>
						</div>

							<div className="delete-container">
								<div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
								</div>
							</div>

					</div>
				)) : (
					<p>Please Create Some Tasks!</p>
				)}
			</div>
			<div className={!popupActive ? " popup" : "popup IsActive"}>
					<div className="content">
						<h3>Add Task</h3>
						<input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} ref={InputRef}/>
						<div className="button" onClick={addTodo}>Create Task</div>
					</div>
				<div className={!popupActive ? " addPopup" : "addPopup IsActive"} onClick={() => {InputRef.current.focus(); setPopupActive(prevPopupActive => !prevPopupActive)}}>
					<div className="popupMark"></div>
				</div>
			</div>

		</div>

	);
}

export default App;
