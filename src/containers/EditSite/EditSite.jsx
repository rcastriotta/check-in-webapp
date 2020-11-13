import React, { useEffect, useCallback, useState } from 'react';
import ValidateTotalCheckIns from '../../utils/ValidateTotalCheckIns';

// STYLES
import styles from './EditSite.module.css';

// EXTERNAL
import { MdArrowBack } from 'react-icons/md';
import dateFormat from 'dateformat';
import InfiniteScroll from 'react-infinite-scroller';

// COMPONENTS
import InfoPanel from '../../components/Edit/InfoPanel/InfoPanel';
import QRPanel from '../../components/Edit/QRPanel/QRPanel';
import Panel from '../../components/UI/Panel/Panel';
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import ChartPanel from '../../components/Edit/ChartPanel/ChartPanel';
import User from '../../models/user';
import Item from '../../components/UI/Item/Item';

// FIREBASE
import { fs } from '../../firebase/config';

// REDUX
import { useSelector } from 'react-redux';

const EditSite = (props) => {
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])
    const [count, setCount] = useState(0)
    const [id, setId] = useState(null)
    const [lastVisible, setLastVisible] = useState(null)
    const code = props.history.location.pathname.split('sites/')[1]
    const uid = useSelector(state => state.auth.uid)
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // fetch all check-ins from this location
    const getUsers = useCallback(() => {
        setIsLoading(true)
        let query = fs.collection("checkIns").where("code", "==", code).where("ownerId", "==", uid).orderBy("checkedInAt", "desc").limit(25)

        if (searchText.length > 0) {
            const text = searchText.toLowerCase().replace(/ /g, '')
            query = fs.collection(`checkIns`).where("code", "==", code).where("ownerId", "==", uid).where("searchKeywords", "array-contains", text).limit(25)

        }
        query.get().then((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(
                    new User(
                        doc.data().name,
                        doc.data().email,
                        doc.data().phoneNumber,
                        dateFormat(doc.data().checkedInAt.toDate()),
                        dateFormat(doc.data().checkedInAt.toDate())
                    )
                )
            })
            setUsers(users)
            if (querySnapshot.size < 25) {
                setLastVisible(null)
            } else {
                setLastVisible(querySnapshot.docs[querySnapshot.size - 1])
            }
            setIsLoading(false)
        })
    }, [code, uid, searchText])


    const loadMore = () => {
        if (lastVisible) {

            let query = fs.collection("checkIns").where("code", "==", code).where("ownerId", "==", uid).orderBy("checkedInAt", "desc").startAfter(lastVisible).limit(25)

            if (searchText.length > 0) {
                const text = searchText.toLowerCase().replace(/ /g, '')
                query = fs.collection(`checkIns`).where("code", "==", code).where("ownerId", "==", uid).where("searchKeywords", "array-contains", text).startAfter(lastVisible).limit(25)
            }

            query.get().then((querySnapshot) => {
                const newUsers = users
                querySnapshot.forEach((doc) => {
                    newUsers.push(
                        new User(
                            doc.data().name,
                            doc.data().email,
                            doc.data().phoneNumber,
                            dateFormat(doc.data().checkedInAt.toDate()),
                            dateFormat(doc.data().checkedInAt.toDate())
                        )
                    )
                })
                setUsers(newUsers)
                console.log(newUsers.length)
                if (querySnapshot.size < 25) {
                    setLastVisible(null)
                } else {
                    setLastVisible(querySnapshot.docs[querySnapshot.size - 1])
                }

            })
        }

    }

    const getData = useCallback((code) => {
        const query = fs.collection("locations").where("code", "==", code).where("ownerId", "==", uid)

        // get site information from database
        query.get().then((querySnapshot) => {
            if (querySnapshot.size === 0) {
                props.history.replace('/sites')
                return;
            }
            getUsers()
            querySnapshot.forEach((doc) => {
                setName(doc.data().name);
                setId(doc.id)

                if (ValidateTotalCheckIns(doc.data().lastCheckIn)) {
                    setCount(doc.data().dailyCount)
                }
            })
        })
    }, [uid, props.history, getUsers])


    useEffect(() => {
        getData(code)
    }, [getData, code])

    const deleteSite = () => {
        if (id) {
            fs.collection("locations").doc(id).delete().then(() => {
                props.history.go(0)
            })
        }
    }

    const searchTextHandler = (event) => {
        const text = event.target.value;
        setSearchText(text)
    }


    return (
        <div>
            <div className={styles.TopContainer}>
                <div onClick={() => props.history.goBack()} className={styles.GoBack}>
                    <MdArrowBack color={"rgba(46, 101, 253, 1)"} size={30} style={{ marginRight: "15px" }} />
                    <h2>Go Back</h2>
                </div>
                <span className={styles.Delete} onClick={deleteSite}>Delete</span>
            </div>
            <div className={styles.Panels}>
                <InfoPanel name={name} code={code} />
                <div className={styles.Divider} />
                <ChartPanel count={count} />
                <div className={styles.Divider} />
                <QRPanel code={code} />
            </div>
            <div className={styles.SearchBarContainer} >
                <SearchBar searchTextHandler={searchTextHandler} text={searchText} />
            </div>
            <Panel loading={isLoading} title="Check-ins" labels={["Email", "Phone", "Date"]} data={users}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={true || false}
                    useWindow={true}
                    threshold={0}
                >
                    {users.map(user => {
                        const itemArr = [user.email, user.phoneNumber, user.checkedInAt]
                        return (
                            <Item key={Math.random()} title={user.name} itemArr={itemArr} onClick={() => { }} />
                        )
                    })}
                </InfiniteScroll>

            </Panel>
        </div>
    )
}

export default EditSite;