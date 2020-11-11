import React, { useEffect, useState } from 'react';

// STYLES
import styles from './Login.module.css';

// COMPONENTS
import Input from '../../../components/UI/Input/Input';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../../store/actions/auth';

// EXTERNAL
import Loader from 'react-loader-spinner'


const Login = (props) => {
    const errorMSG = useSelector(state => state.auth.errorMSG)
    const isLoading = useSelector(state => state.auth.isLoading)
    const [state, setState] = useState({
        email: {
            text: '',
            valid: false
        },
        password: {
            text: '',
            valid: false
        },
    })
    const dispatch = useDispatch()

    // clear any errors
    useEffect(() => {
        dispatch(authActions.error())
    }, [dispatch])

    const buttonPressHandler = () => {
        props.history.replace('/signup')
    }

    const inputChangeHandler = (event, id) => {
        const text = event.target.value
        const valid = text.length > 0

        setState({
            ...state, [id]: {
                text: text,
                valid
            }
        })
    }

    const submitButtonHandler = () => {
        // dispatch redux action
        if (state.email.valid && state.password.valid) {
            dispatch(authActions.login(state.email.text, state.password.text))
        }
    }

    let ButtonClasses;

    if (state.email.valid && state.password.valid) {
        ButtonClasses = `${styles.Button}`
    } else {
        ButtonClasses = `${styles.ButtonNotActive}`
    }

    return (
        <React.Fragment>
            <div className={styles.Login}>
                <h2>Login</h2>
                <div className={styles.Form}>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        id="email"
                        onChange={inputChangeHandler}
                        text={state.email.text}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={inputChangeHandler}
                        text={state.password.text}
                    />
                </div>
                <div className={styles.ButtonContainer}>
                    <button className={ButtonClasses} onClick={submitButtonHandler}>Login</button>
                    <span className={styles.Text}>Don't have an account? <span onClick={buttonPressHandler} className={styles.TextButton}>Signup</span></span>
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

export default Login;