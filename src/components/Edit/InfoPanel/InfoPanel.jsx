import React from 'react';

// STYLES
import styles from './InfoPanel.module.css';


const InfoPanel = (props) => {

    return (
        <div className={styles.Panel}>
            <h4>Name</h4>
            <span className={styles.CodeText}>{props.name}</span>

            <h4>Code</h4>
            <span className={styles.CodeText}>{props.code}</span>

        </div>
    )
}

export default InfoPanel;