import React from 'react';

// STYLES
import styles from './Square.module.css'

const Square = (props) => {

    return (
        <div className={styles.Square}>
            <h5>{props.title}</h5>
            <div className={props.amount ? styles.Circle : styles.CircleText}>
                {props.amount ? props.amount : props.text}
            </div>
        </div>
    )
}

export default Square;