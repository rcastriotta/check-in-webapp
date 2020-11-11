import { fs } from '../../firebase/config';
import firebase from 'firebase/app';
import Site from '../../models/site';
import dateFormat from 'dateformat';
import ValidateTotalCheckIns from '../../utils/ValidateTotalCheckIns';

// TYPES
export const FETCH_SITES = "FETCH_SITES";
export const UPLOADING = "UPLOADING";
export const FETCHING = "FETCHING";
export const ERROR = "ERROR"

export const fetchSites = () => {
    return async(dispatch, getState) => {
        dispatch(fetching(true))
        const query = fs.collection("locations").where("ownerId", "==", getState().auth.uid).orderBy("createdAt", "desc")

        query.get().then((querySnapshot) => {
            const sites = [];
            querySnapshot.forEach((doc) => {
                let dailyCount = 0;
                if (ValidateTotalCheckIns(doc.data().lastCheckIn)) {
                    dailyCount = doc.data().dailyCount
                }

                sites.push(new Site(
                    doc.data().name,
                    doc.data().code,
                    doc.data().lastCheckIn ? dateFormat(doc.data().lastCheckIn.toDate()) : '-',
                    dateFormat(doc.data().createdAt.toDate()),
                    dailyCount,
                    doc.id
                ))
            })

            dispatch({ type: FETCH_SITES, sites: sites })
            dispatch(fetching(false))
        }).catch((err) => dispatch(error(err)))
    }
}

export const uploadSite = (code, name) => {
    return async(dispatch, getState) => {
        dispatch(uploading(true))
        fs.collection('locations').add({
                code,
                name,
                ownerId: getState().auth.uid,
                lastCheckIn: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                dailyCount: 0,
            })
            .then(() => {
                dispatch(uploading(false))
            })
            .catch((err) => {
                dispatch(error(err))
            })
    }
}


export const uploading = (isUploading) => {
    return (dispatch) => {
        dispatch({ type: UPLOADING, isUploading })
    }
}

export const error = (errorMSG) => {
    return (dispatch) => {
        dispatch({ type: ERROR, errorMSG: errorMSG.toString() })
    }
}

export const fetching = (isFetching) => {
    return (dispatch) => {
        dispatch({ type: FETCHING, isFetching })
    }
}