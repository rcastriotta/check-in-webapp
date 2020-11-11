import React, { useEffect, useState, useCallback } from 'react';
import logo from '../../../assets/logo.png';
// STYLES
import styles from './Sidebar.module.css';

// ROUTER
import { useHistory } from 'react-router-dom'

// EXTERNAL
import { MdHome, MdPeople, MdPerson, MdStore } from 'react-icons/md';

// REDUX
import { useDispatch } from 'react-redux'
import * as authActions from '../../../store/actions/auth';



const Sidebar = () => {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const history = useHistory();
    const dispatch = useDispatch()

    const getIndex = useCallback((location) => {
        if (location === "/home") {
            setSelectedIndex(0)
        } else if (location.includes('/sites')) {
            setSelectedIndex(1)
        } else if (location.includes("/users")) {
            setSelectedIndex(2)
        } else if (location === "/account") {
            setSelectedIndex(3)
        }
    }, [])

    useEffect(() => {
        getIndex(history.location.pathname)
    }, [getIndex, history.location.pathname])

    const aryMenu = [
        { label: 'Home', icon: <MdHome size={20} style={selectedIndex === 0 ? { color: 'rgba(46, 101, 253, 1)', marginRight: '20px' } : { marginRight: '20px', color: 'gray' }} />, url: '/home', index: 0 },
        { label: 'Sites', icon: <MdStore size={20} style={selectedIndex === 1 ? { color: 'rgba(46, 101, 253, 1)', marginRight: '20px' } : { marginRight: '20px', color: 'gray' }} />, url: '/sites', index: 1 },
        { label: 'Users', icon: <MdPeople size={20} style={selectedIndex === 2 ? { color: 'rgba(46, 101, 253, 1)', marginRight: '20px' } : { marginRight: '20px', color: 'gray' }} />, url: '/users', index: 2 },
        { label: 'Account', icon: <MdPerson size={20} style={selectedIndex === 3 ? { color: 'rgba(46, 101, 253, 1)', marginRight: '20px' } : { marginRight: '20px', color: 'gray' }} />, url: '/account', index: 3 },
    ];

    const itemSelectedHandler = (item) => {
        setSelectedIndex(aryMenu.indexOf(item))
        history.replace(`${item.url}`)

    }

    const logout = () => {
        dispatch(authActions.signOut())
    }
    return (
        <div className={styles.Sidebar}>
            <div className={styles.LogoContainer}>
                <img className={styles.Logo} src={logo} alt="logo" />
            </div>
            <div className={styles.ItemsContainer}>
                {aryMenu.map(item => {
                    const active = item.index === selectedIndex;
                    let divClasses = `${styles.ItemDiv}`
                    let textClasses = `${styles.Text}`;
                    if (active) {
                        divClasses = `${styles.ItemDiv} ${styles.Selected}`
                        textClasses = `${styles.Text} ${styles.TextSelected}`
                    }
                    return (
                        <div className={divClasses} key={item.label} onClick={() => itemSelectedHandler(item)}>

                            <div className={styles.activeBar} hidden={!active} />
                            {item.icon}
                            <div className={styles.TextDiv} ><span className={textClasses}>{item.label}</span></div>
                        </div>
                    )
                })}
            </div>
            <div className={styles.Logout}>
                <a href="/login"> <span className={styles.LogoutText} onClick={logout}>Logout</span></a>

            </div>
        </div>
    )
}

export default Sidebar;