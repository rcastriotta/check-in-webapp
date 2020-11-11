import React from 'react';

// STYLES
import styles from './Input.module.css';
const Input = (props) => {

    let classes = `${styles.Input}`

    if (props.valid === false && props.text.length > 0) {
        classes = `${styles.Input} ${styles.NotValid}`
    }
    return (
        <input
            className={classes}
            value={props.text}
            type={props.type}
            placeholder={props.placeholder}
            onChange={(event) => props.onChange(event, props.id)}
            style={props.height ? { height: props.height } : null}
        />
    )
}

export default Input;