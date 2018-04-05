import React from 'react'

export default (Consumer, mapStoreToProps = (store) => store) => ComponentToWrap => ownProps =>
    <Consumer>
        {store =>
            <ComponentToWrap
                {...ownProps}
                {...mapStoreToProps(store, ownProps)}
            />
        }
    </Consumer>
