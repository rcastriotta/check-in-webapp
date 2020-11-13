import React, { useEffect, useCallback, useState } from 'react';
import CheckIn from '../../models/checkIn';
// STYLES
import styles from './UserInfo.module.css';

// EXTERNAL
import { MdArrowBack } from 'react-icons/md';
import dateFormat from 'dateformat';
import InfiniteScroll from 'react-infinite-scroller';


// REDUX
import { useSelector } from 'react-redux';

// FIREBASE
import { fs } from '../../firebase/config';

// COMPONENTS
import Panel from '../../components/UI/Panel/Panel';
import UserBar from '../../components/User/UserBar';
import Item from '../../components/UI/Item/Item';


const UserInfo = (props) => {
    const userId = props.history.location.pathname.split('/users/')[1]
    const uid = useSelector(state => state.auth.uid)
    const [isLoading, setIsLoading] = useState(false)
    const [lastVisible, setLastVisible] = useState(null)
    const [checkIns, setCheckIns] = useState([])
    const [userInfo, setUserInfo] = useState({
        name: null,
        email: null,
        phoneNumber: null,
        id: null
    })

    // fetch all checkins
    const getCheckins = useCallback(() => {

        setIsLoading(true)
        const query = fs.collection("checkIns").where("userId", "==", userId).where("ownerId", "==", uid).orderBy("checkedInAt", "desc").limit(25)

        query.get().then((querySnapshot) => {
            const checkIns = [];
            let firstItem = true;
            querySnapshot.forEach((doc) => {
                if (firstItem) {
                    setUserInfo({
                        name: doc.data().name,
                        email: doc.data().email,
                        phoneNumber: doc.data().phoneNumber,
                        id: userId
                    })
                    firstItem = false
                }
                checkIns.push(new CheckIn(
                    dateFormat(doc.data().checkedInAt.toDate()),
                    doc.data().siteName,
                    doc.data().code,
                    doc.data().checkedInAt.toDate().toString()
                ))
            })
            setCheckIns(checkIns)
            if (querySnapshot.size < 25) {
                setLastVisible(null)
            } else {
                setLastVisible(querySnapshot.docs[querySnapshot.size - 1])
            }
        })
        setIsLoading(false)
    }, [uid, userId])


    const loadMore = () => {
        if (lastVisible) {
            const query = fs.collection("checkIns").where("userId", "==", userId).where("ownerId", "==", uid).orderBy("checkedInAt", "desc").startAfter(lastVisible).limit(25)

            query.get().then((querySnapshot) => {
                const newCheckins = checkIns
                querySnapshot.forEach((doc) => {
                    newCheckins.push(new CheckIn(
                        dateFormat(doc.data().checkedInAt.toDate()),
                        doc.data().siteName,
                        doc.data().code,
                        doc.data().checkedInAt.toDate().toString()
                    ))
                })
                setCheckIns(newCheckins)
                if (querySnapshot.size < 25) {
                    setLastVisible(null)
                } else {
                    setLastVisible(querySnapshot.docs[querySnapshot.size - 1])
                }

            })
        }

    }

    useEffect(() => {
        getCheckins()
    }, [getCheckins])

    return (
        <div>
            <div onClick={() => props.history.goBack()} className={styles.GoBack}>
                <MdArrowBack color={"rgba(46, 101, 253, 1)"} size={30} style={{ marginRight: "15px" }} />
                <h2>Go Back</h2>
            </div>
            <UserBar user={userInfo} />
            <Panel loading={isLoading} onClick={() => { }} title={"Check-ins"} labels={["Site Code", "Date"]} data={checkIns}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={true || false}
                    useWindow={true}
                    threshold={0}
                >
                    {checkIns.map(checkIn => {
                        const itemArr = [checkIn.siteCode, checkIn.checkedInAt]
                        return (
                            <Item key={Math.random()} title={checkIn.name} itemArr={itemArr} onClick={() => { }} />
                        )
                    })}
                </InfiniteScroll>

            </Panel>
        </div >
    )
}

export default UserInfo;