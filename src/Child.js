import React from 'react'
import { connect } from './lib'
import { StoreConsumer } from './createStore'

const Child = ({ name, age, setUserName, setUserAge, childName }) =>
    <div>
        I am a props passed from direct parent: {childName}
        <ul>
            <li>name: {name}</li>
            <li>age: {age}</li>
        </ul>
        <button
            onClick={() => setUserName('lilolilo')}
        >
            Change to lolilol
        </button>
        <input
            type="number"
            value={age}
            onChange={e => setUserAge(parseInt(e.target.value, 10))}
        />
    </div>

const mapStoreToProps = (store, ownProps) => ({
    name: store.user.name,
    age: store.user.age,
    setUserAge: store.user.setUserAge,
    setUserName: store.user.setUserName
})

export default connect(StoreConsumer, mapStoreToProps)(Child)