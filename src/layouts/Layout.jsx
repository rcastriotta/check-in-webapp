import React from 'react';

// COMPONENTS
import Sidebar from '../components/Navigation/Sidebar/Sidebar';

// STYLES
import styles from './Layout.module.css';

const Layout = (props) => {

    return (
        <React.Fragment>
            <Sidebar />
            <main className={styles.Main}>{props.children}</main>
        </React.Fragment>
    )
}

export default Layout;