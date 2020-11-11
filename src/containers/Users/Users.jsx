import React, { useCallback, useEffect, useState } from 'react';

// COMPONENTS
import SearchBar from '../../components/UI/SearchBar/SearchBar';
import Panel from '../../components/UI/Panel/Panel';
import Item from '../../components/UI/Item/Item';

// STYLES
import styles from './Users.module.css';

// FIREBASE
import { fs } from '../../firebase/config';

// REDUX
import { useSelector } from 'react-redux';

// MODELS
import User from '../../models/user';

// EXTERNAL
import InfiniteScroll from 'react-infinite-scroller';


const labels = ["Email", "Phone", "ID"]

const Users = (props) => {
    const uid = useSelector(state => state.auth.uid)
    const [users, setUsers] = useState([])
    const [lastVisible, setLastVisible] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // fetch all checkins
    const getUsers = useCallback(() => {
        setIsLoading(true)
        let query = fs.collection(`organizations/${uid}/users`).limit(25)

        if (searchText.length > 0) {
            const text = searchText.toLowerCase().replace(/ /g, '')
            query = fs.collection(`organizations/${uid}/users`).orderBy("nameSearchValue").startAt(`${text}`).endAt(`${text}zzzzzzzzzzzzz`)
        }

        query.get().then((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(
                    new User(
                        doc.data().name,
                        doc.data().email,
                        doc.data().phoneNumber,
                        null,
                        doc.data().userId
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
    }, [uid, searchText])

    const loadMore = () => {
        if (lastVisible) {
            let query = fs.collection(`organizations/${uid}/users`).startAfter(lastVisible).limit(25)

            if (searchText.length > 0) {
                const text = searchText.toLowerCase().replace(/ /g, '')
                query = fs.collection(`organizations/${uid}/users`).orderBy("nameSearchValue").startAfter(lastVisible).endAt(`${text}zzzzzzzzzzzzz`).limit(25)
            }

            query.get().then((querySnapshot) => {
                const newUsers = users
                querySnapshot.forEach((doc) => {
                    newUsers.push(
                        new User(
                            doc.data().name,
                            doc.data().email,
                            doc.data().phoneNumber,

                        )
                    )
                })
                setUsers(newUsers)
                if (querySnapshot.size < 25) {
                    setLastVisible(null)
                } else {
                    setLastVisible(querySnapshot.docs[querySnapshot.size - 1])
                }

            })
        }
    }


    useEffect(() => {
        getUsers()
    }, [getUsers])

    const onClickHandler = (id) => {

        props.history.push(`users/${id}`)
    }

    const searchTextHandler = (event) => {
        const text = event.target.value;
        setSearchText(text)
    }

    return (
        <div>
            <div className={styles.SearchBarContainer}>
                <SearchBar text={searchText} searchTextHandler={searchTextHandler} />
            </div>
            <Panel onClick={onClickHandler} title={"Users"} labels={labels} loading={isLoading}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={true || false}
                    useWindow={true}
                    threshold={0}
                >
                    {users.map(user => {
                        const itemArr = [user.email, user.phoneNumber, user.id]
                        return (
                            <Item key={Math.random()} title={user.name} itemArr={itemArr} onClick={() => onClickHandler(user.id)} />
                        )
                    })}
                </InfiniteScroll>
            </Panel>
        </div>
    )
}

export default Users;