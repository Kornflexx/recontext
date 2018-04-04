import React from 'react'
import { connect } from './lib'
import { StoreConsumer } from './createStore'

const Child = ({ user }) =>
    <div>
        <ul>
            <li>name: {user.name}</li>
            <li>age: {user.age}</li>
        </ul>
        <button
            onClick={() => user.setUserName('lilolilo')}
        >
            Change to lolilol
        </button>
        <input
            type="number"
            value={user.age}
            onChange={e => user.setUserAge(parseInt(e.target.value, 10))}
        />
    </div>

export default connect(StoreConsumer)(Child)