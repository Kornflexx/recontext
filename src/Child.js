import React from 'react'
import { connect } from './lib'
import { StoreConsumer } from './createStore'

const Child = ({ user, setUserName, setUserAge }) =>
    <div>
        <ul>
            <li>name: {user.name}</li>
            <li>age: {user.age}</li>
        </ul>
        <button
            onClick={() => setUserName('lilolilo')}
        >
            Change to lolilol
        </button>
        <input
            type="number"
            onChange={e => setUserAge(e.target.value)}
            value={user.age}
        />
    </div>

export default connect(StoreConsumer)(Child)