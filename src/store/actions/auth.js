import { auth, fs } from '../../firebase/config';

// TYPES
export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'
export const SIGNOUT = 'SIGNOUT'
export const PUSHINFO = 'PUSHINFO'
export const SET_NAME = 'SET_NAME'
export const ERROR = 'ERROR'
export const LOADING = 'LOADING'

export const login = (email, password) => {
    return async(dispatch) => {
        dispatch(error()) // clears any existing errors
        dispatch(loading(true))
        try {
            await auth.signInWithEmailAndPassword(email, password).then(() => {
                const uid = auth.currentUser.uid
                const email = auth.currentUser.email
                const name = auth.currentUser.displayName
                const creationDate = auth.currentUser.metadata.creationTime


                dispatch({ type: LOGIN, uid, name, email, creationDate })
                dispatch(loading(false))
            })

        } catch (err) {
            dispatch(error(err))
        }
    }
}

export const signup = (email, password, name) => {
    return async(dispatch) => {
        dispatch(error()) // clears any existing errors
        dispatch(loading(true));
        //we can .then the function and add data to firestore (name)
        name = name.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
        email = email.toLowerCase()
        await auth.createUserWithEmailAndPassword(email, password)
            .then(function(result) {
                const uid = result.user.uid
                const creationDate = result.user.metadata.creationTime;
                // update name 
                result.user.updateProfile({
                    displayName: name
                })

                dispatch({ type: SIGNUP, uid, name, email, creationDate })
                dispatch(loading(false));

                // add user to firestore
                fs.collection('organizations').doc(uid).set({
                    email,
                    accountCreationDate: creationDate,
                    paymentMethod: null,
                })

            })
            .catch(function(err) {
                dispatch(error(err))
            });

    }
}

export const pushInfo = (userObj) => {
    return (dispatch) => {
        const name = userObj.displayName
        const email = userObj.email
        const uid = userObj.uid
        const creationDate = userObj.metadata.creationTime

        dispatch({ type: PUSHINFO, name, email, uid, creationDate })
    }
}

export const signOut = () => {
    return (dispatch) => {
        auth.signOut().then(() => {
            dispatch({ type: SIGNOUT })
        })
    }
}


export const setName = (name) => {
    return (dispatch) => {
        dispatch({ type: SET_NAME, name: name })
    }
}

export const error = (errorMSG) => {
    let formattedError = errorMSG
    if (errorMSG) {
        formattedError = errorMSG.toString()
    }
    return (dispatch) => {
        dispatch({ type: ERROR, errorMSG: formattedError })
    }
}

export const loading = (isLoading) => {
    return (dispatch) => {
        dispatch({ type: LOADING, isLoading })
    }
}