import React from 'react';

// STYLES
import styles from './Panel.module.css';

// EXTERNAL
import Loader from 'react-loader-spinner'

const Panel = (props) => {

    return (
        <div className={props.styles ? props.styles : styles.Panel} >
            <div className={styles.Header}>
                <div className={styles.LabelContainerTitle}><h2 className={styles.Title}>{props.title}</h2></div>
                {props.labels.map((label) => (
                    <div key={label} className={styles.LabelContainer}><h4 className={styles.Label}>{label}</h4></div>
                ))}
            </div>
            <div className={styles.Divider} />
            {props.loading
                ? <Loader
                    type="TailSpin"
                    color={'rgba(46, 101, 253, 1)'}
                    height={100}
                    width={100}
                    style={{ marginTop: '50px' }}
                />
                : props.children
            }
        </div>
    )
}


export default Panel;