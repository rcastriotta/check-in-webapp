import React from 'react';

import styles from './UserBar.module.css';

const UserBar = (props) => {

    return (
        <div className={styles.UserBar}>
            <div className={styles.ItemDiv}>
                <span>Name: <span className={styles.InfoText}>{props.user.name}</span></span>
            </div>
            <div className={styles.Divider} />
            <div className={styles.ItemDiv}>
                <span>Phone: <span className={styles.InfoText}>{props.user.phoneNumber}</span></span>
            </div>
            <div className={styles.Divider} />
            <div className={styles.ItemDiv}>
                <span>Email: <span className={styles.InfoText}>{props.user.email}</span></span>
            </div>
        </div>
    )
}

export default UserBar;