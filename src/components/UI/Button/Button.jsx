import React from 'react';

// STYLES
import styles from './Button.module.css';

const Button = (props) => {
    let classes = `${styles.Button}`
    if (props.formValid === false) {
        classes = `${styles.ButtonNotValid}`
    }
    return (
        <button onClick={props.onClick} className={classes}>{props.children}</button>
    )
}

export default Button;