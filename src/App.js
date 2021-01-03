import React, { useReducer, useMemo, createContext } from 'react';
import CreateUser from './CreateUser';
import UserList from "./UserList";
import produce from 'immer'

function countActiveUsers(users) {
  console.log("활성 사용자 수를 세는 중...");
  return users.filter(user => user.active).length;
}

const initialState = {
  users: [
    {
      id: 1,
      username: "박건웅",
      email: "bung1438@gmail.com",
      active: true
    },
    {
      id: 2,
      username: 'tester',
      email: "tester@example.com",
      active: false
    },
    {
      id: 3,
      username: 'liz',
      email: "liz@example.com",
      active: false
    }
  ]
}

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_USER':
      return produce(state, draft => {
        draft.users.push(action.user);
      });
    // return {
    //   inputs: initialState.inputs,
    //   users: state.users.concat(action.user)
    // };
    case 'TOGGLE_USER':
      return produce(state, draft => {
        const user = draft.users.find(user => user.id === action.id);
        user.active = !user.active;
      });
    // return {
    //   ...state,
    //   users: state.users.map(user =>
    //     user.id === action.id
    //       ? { ...user, active: !user.active }
    //       : user
    //   )
    // }
    case 'REMOVE_USER':
      return produce(state, draft => {
        const index = draft.users.findIndex(user => user.id === action.id);
        draft.users.splice(index, 1);
      })
    // return {
    //   users: state.users.filter(user => user.id !== action.id)
    // }

    default:
      throw new Error('Unhandled action');

  }
}

// 다른 컴포넌트로부터 사용할 수 있도록 방출
export const UserDispatch = createContext(null);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { users } = state;

  const count = useMemo(() => countActiveUsers(users), [users])

  return (
    <UserDispatch.Provider value={dispatch}>
      <CreateUser />
      <UserList users={users} />
      <div>활성 사용자 수:{count}</div>
    </UserDispatch.Provider>
  );
}

export default App;
