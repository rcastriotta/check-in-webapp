import React, { useState, useEffect, useCallback } from 'react';

// COMPONENTS
import Panel from '../../components/UI/Panel/Panel';
import Button from '../../components/UI/Button/Button';
import AddModal from '../../components/Add/AddModal';
import Item from '../../components/UI/Item/Item';

// STYLES 
import styles from './Sites.module.css';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as siteActions from '../../store/actions/sites';


const labels = ["Code", "Last check-in", "Created"]

const Sites = (props) => {
    const [showModal, setShowModal] = useState(false)
    const sites = useSelector(state => state.sites.sites)
    const isLoading = useSelector(state => state.sites.fetching)
    const dispatch = useDispatch()


    const getSites = useCallback(() => {
        dispatch(siteActions.fetchSites())
    }, [dispatch])

    useEffect(() => {
        // get sites if null
        if (!sites) {
            getSites()
        }
    }, [sites, getSites])

    const itemClickHandler = (id) => {
        props.history.push(`sites/${id}`)
    }

    return (
        <React.Fragment>
            <div className={styles.ModalDiv}>
                <AddModal refetch={getSites} closeModal={() => setShowModal(false)} show={showModal} />
            </div>

            <div className={styles.Sites}>
                <div className={styles.ButtonContainer}>
                    <Button onClick={() => setShowModal(true)} >Add</Button>
                </div>
                <Panel loading={isLoading} onClick={itemClickHandler} title={"Sites"} labels={labels} data={sites}>
                    {sites && sites.map(site => {
                        const itemArr = [site.code, site.lastCheckIn, site.createdAt]
                        return (
                            <Item key={Math.random()} title={site.name} itemArr={itemArr} onClick={() => itemClickHandler(site.code)} />
                        )
                    })}
                </Panel>

            </div>
        </React.Fragment>

    )
}

export default Sites;