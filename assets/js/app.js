// add todo to localStorage
function addItem(event) {
    event.preventDefault();

    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const status = 'ToDo';

    let dataObject = {
        title: title.value,
        description: description.value,
        status : status
    };

    let todoId = addToLocalStorage(dataObject);

    console.log(todoId);

    createCard(title.value, description.value, status, todoId);

    title.value = '';
    description.value = '';

}

// create new card with title, description, status and add to home tasks list
function createCard(title, description, status, id) {
    let mt_p = document.querySelector('p.mt');
    if(mt_p != null) {
        mt_p.remove();
    }

    const afterTop = document.querySelector('.after-top');
    afterTop.classList.remove('middleText');

    const tasksCard = document.querySelector("div.tasks-card");
    
    const card = document.createElement('div');
    card.classList.add('card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const h3 = document.createElement('h3');
    h3.innerText = title;

    const p = document.createElement('p');
    p.innerText = description;

    const button = document.createElement('button');
    const buttonText = document.createTextNode(status);
    button.appendChild(buttonText);

    const a = document.createElement('a');
    a.href = "edit.html?id="+id;

    const img = document.createElement('img');
    img.classList.add('svg');
    img.src = "./assets/images/beditor.svg";

    cardHeader.appendChild(h3);
    cardBody.appendChild(p);
    a.appendChild(img);
    cardFooter.appendChild(button);
    cardFooter.appendChild(a);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    tasksCard.appendChild(card);
}

// save new data to localStorage
function addToLocalStorage(data) {
    let todos;
    if(window.localStorage.getItem('todos') == null) {
        todos = [];
    }else{
        todos = JSON.parse(window.localStorage.getItem('todos'));
    }

    data.id = (todos.length)+1;

    todos.push(data);

    window.localStorage.setItem('todos', JSON.stringify(todos));

    return data.id;
}

// show all todos when page loading
function showTodos() {
    if(window.localStorage.getItem('todos') != null) {
        let todos = JSON.parse(window.localStorage.getItem('todos'));
        for(let i=0; i<todos.length; i++) {
           createCard(todos[i].title, todos[i].description, todos[i].status, todos[i].id);
        }
    }else{
        const afterTop = document.querySelector('div.after-top');
        afterTop.classList.add('middleText');
        const p = document.createElement('p');
        p.classList.add('mt');
        p.innerHTML = "You have nothing to do.<br>Go get some sleep.";
        afterTop.appendChild(p);
    }
}

// get data and edit
function editTodo() {
    let selectedTodoCheck = false;
    let selectedTodo;
    var match = RegExp('[?&]id=([^&]*)').exec(window.location.search);
    let query = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    
    if(window.localStorage.getItem('todos') == null) {
        alert('todo not found');
        return window.location.href = 'home.html';
    }

    let todos = JSON.parse(window.localStorage.getItem('todos'));
    for(let i=0; i<todos.length; i++) {
        if(todos[i].id == query) {
            selectedTodoCheck = true;
            selectedTodo = todos[i];
        }
    }
    if(selectedTodoCheck == false) {
        alert('todo not found');
        return window.location.href = 'home.html';
    }
    

    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const id = document.querySelector("input[type='hidden']");

    title.value = selectedTodo.title;
    description.value = selectedTodo.description;
    id.value = selectedTodo.id;

    let options = [];

    if(selectedTodo.status == 'ToDo') {
        options.push('InProgress');
    }else if(selectedTodo.status == 'InProgress') {
        options.push('Blocked');
        options.push('InQA');
    }else if(selectedTodo.status == 'Blocked') {
        options.push('ToDo');
    }else if(selectedTodo.status == 'InQA') {
        options.push('ToDo');
        options.push('Done');
    }else if(selectedTodo.status == 'Done') {
        options.push('Deployed');
    }

    const select = document.querySelector('select');

    for(let i=0; i<options.length; i++) {
        let option = document.createElement('option');
        let optionText = document.createTextNode(options[i]);
        option.appendChild(optionText);
        option.value = options[i];
        select.appendChild(option);
    }

    

}


// update todo in edit page
function updateTodo(event) {
    event.preventDefault();

    let selectedTodoCheck = false;
    let todoIndex;
    
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const status = document.querySelector('select');
    const id = document.querySelector("input[type='hidden']");

    let dataObject = {
        title: title.value,
        description: description.value,
        status : status.value,
        id : id.value
    };

    let todos = JSON.parse(window.localStorage.getItem('todos'));
    let index;
    
    for(let i=0; i<todos.length; i++) {
        if(todos[i].id == id.value) {
            selectedTodoCheck = true;
            todos.splice(i, 1);
            todos.push(dataObject);
            window.localStorage.setItem('todos',JSON.stringify(todos));
            break;
        }
    }

    if(selectedTodoCheck == false) {
        alert('todo not found');
        return window.location.reload();
    }else{
        alert('Todo Updated!');
        return window.location.href = "home.html";
    }

    
}

// cancle function in edit page
function cancleButton(event) {
    event.preventDefault();
    return window.location.href = 'home.html';
}