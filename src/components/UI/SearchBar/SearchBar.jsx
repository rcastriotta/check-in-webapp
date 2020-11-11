import React from 'react';

// STYLES
import styles from './SearchBar.module.css';

// EXTERNAL
import { MdSearch } from 'react-icons/md';

const SearchBar = (props) => {

    return (
        <div className={styles.SearchBar}>
            <MdSearch color="rgba(46, 101, 253, 1)" size={25} style={{ marginRight: '10px' }} />
            <input value={props.text} onChange={props.searchTextHandler} className={styles.Input} placeholder="Search People" />
        </div>

    )
}

export default SearchBar;