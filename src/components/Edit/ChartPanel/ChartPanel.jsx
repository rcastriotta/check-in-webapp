import React from 'react';

// STYLES
import styles from './ChartPanel.module.css';

const ChartPanel = (props) => {


    return (
        <div className={styles.Panel}>
            <h1 className={styles.H1}>{props.count}</h1>
            <span className={styles.text}>Check-ins today</span>
        </div>
    )
}

export default ChartPanel;