export const fetchTodos = (filter) => fetch('http://10.0.2.28:4984/afame/'+filter, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(
    (res) => res.json()).then((res) => [res]);

