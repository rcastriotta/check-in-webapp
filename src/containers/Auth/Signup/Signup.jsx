import React, { useState, useEffect } from 'react';

// STYLES
import styles from './Signup.module.css';

// COMPONENTS
import Input from '../../../components/UI/Input/Input';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../../store/actions/auth';

// EXTERNAL
import * as EmailValidator from 'email-validator';
import Loader from 'react-loader-spinner'

const Signup = (props) => {
    const errorMSG = useSelector(state => state.auth.errorMSG)
    const isLoading = useSelector(state => state.auth.isLoading)
    const [state, setState] = useState({
        name: {
            valid: false,
            text: ''
        },
        email: {
            valid: false,
            text: ''
        },
        password: {
            valid: false,
            text: ''
        },
        passwordc: {
            valid: false,
            text: ''
        },
    })
    const dispatch = useDispatch()

    // clear any errors
    useEffect(() => {
        dispatch(authActions.error())
    }, [dispatch])

    const buttonPressHandler = () => {
        props.history.replace('/login')
    }


    const checkValid = (text, id) => {
        if (id === "name") {
            return text.length > 5
        } else if (id === "email") {
            return EmailValidator.validate(text)
        } else if (id === "password") {
            return text.length > 7
        } else if (id === "passwordc") {
            return text === state.password.text
        }
    }

    const inputChangeHandler = (event, id) => {
        const text = event.target.value
        const valid = checkValid(text, id)

        setState({
            ...state, [id]: {
                valid: valid,
                text: text
            }
        })
    }

    const submitButtonHandler = () => {
        if (state.name.valid
            && state.email.valid
            && state.password.valid
            && state.passwordc.valid) {
            dispatch(authActions.signup(state.email.text, state.password.text, state.name.text))
        }
    }

    let ButtonClasses;

    if (state.name.valid && state.email.valid && state.password.valid && state.passwordc.valid) {
        ButtonClasses = `${styles.Button}`
    } else {
        ButtonClasses = `${styles.ButtonNotActive}`
    }

    return (
        <React.Fragment>
            <div className={styles.Signup}>
                <h2>Sign Up</h2>
                <div className={styles.Form}>
                    <Input
                        type="text"
                        placeholder="Organization Name"
                        onChange={inputChangeHandler}
                        id={"name"}
                        text={state.name.text}
                        valid={state.name.valid}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        onChange={inputChangeHandler}
                        id={"email"}
                        text={state.email.text}
                        valid={state.email.valid}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={inputChangeHandler}
                        id={"password"}
                        text={state.password.text}
                        valid={state.password.valid}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={inputChangeHandler}
                        id={"passwordc"}
                        text={state.passwordc.text}
                        valid={state.passwordc.valid}
                    />
                </div>
                <div className={styles.ButtonContainer}>
                    <button className={ButtonClasses} onClick={submitButtonHandler}>Signup</button>
                    <span className={styles.Text}>Already have an account? <span onClick={buttonPressHandler} className={styles.TextButton}>Login</span></span>
                </div>

            </div>

            {errorMSG && <div className={styles.Error}>
                <span>{errorMSG}</span>
            </div>}

            {isLoading && <div className={styles.LoaderContainer}>
                <Loader
                    type="TailSpin"
                    color={'rgba(46, 101, 253, 1)'}
                    height={100}
                    width={100}
                />
            </div>}
        </React.Fragment>


    )
}

export default Signup;