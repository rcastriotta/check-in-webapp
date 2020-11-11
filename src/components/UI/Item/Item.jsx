import React from 'react';

// STYLES
import styles from './Item.module.css';


const Item = (props) => {
    let classes = styles.Item

    if (props.onClick) {
        classes = `${styles.Item} ${styles.Pressable}`
    }

    return (
        <div onClick={props.onClick} className={classes}>
            <div className={styles.LabelContainerTitle}><h3>{props.title}</h3></div>
            {props.itemArr.map(item => (
                <div key={Math.random()} className={styles.LabelContainer}><span>{item}</span></div>
            ))}

        </div>
    )
}

export default Item;