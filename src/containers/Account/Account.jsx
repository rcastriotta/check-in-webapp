import React, { useState } from 'react';

// STYLES
import styles from './Account.module.css';

// COMPONENTS
import Input from '../../components/UI/Input/Input';

// Firebase
import { auth } from '../../firebase/config';

// REDUX
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from '../../store/actions/auth';

const Account = () => {
    const userData = useSelector(state => state.auth)
    const [nameText, setNameText] = useState(userData.name)
    const dispatch = useDispatch()
    let buttonClasses;

    const updateName = () => {
        if (nameText !== userData.name && nameText.length > 5) {
            auth.currentUser.updateProfile({
                displayName: nameText
            }).then(() => {
                dispatch(authActions.setName(nameText))
            })
        }
    }

    if (userData.name === nameText || nameText.length < 6) {
        buttonClasses = `${styles.NotActive}`
    } else {
        buttonClasses = `${styles.SaveButton}`
    }

    const onChangeText = (event) => {
        const text = event.target.value
        setNameText(text)
    }

    return (
        <div className={styles.Account}>
            <div className={styles.TopContainer}>
                <h2 className={styles.Title}>Account Info</h2>
                <button onClick={updateName} className={buttonClasses}>Save</button>
            </div>
            <div className={styles.Divider} />
            <h4>Organization Name</h4>
            <Input onChange={onChangeText} text={nameText} />
            <h4>Email</h4>
            <span className={styles.Span}>{userData.email}</span>
            <h4>Date Joined</h4>
            <span className={styles.Span}>{userData.creationDate}</span>
            <h4>Last Billed</h4>
            <span>N/A</span>
            <h4>Next Billing Cycle</h4>
            <span>N/A</span>
        </div>
    )
}

export default Account;