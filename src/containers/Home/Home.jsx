import React, { useEffect, useState } from 'react';

// REDUX
import { useSelector, useDispatch } from 'react-redux';
import * as sitesActions from '../../store/actions/sites';

// STYLES
import styles from './Home.module.css';

// COMPONENTS
import Square from '../../components/UI/Square/Square';
import Panel from '../../components/UI/Panel/Panel';
import Item from '../../components/UI/Item/Item';


const Home = (props) => {
    const name = useSelector(state => state.auth.name)
    const sites = useSelector(state => state.sites.sites)
    const isLoading = useSelector(state => state.sites.fetching)
    const [state, setState] = useState({
        checkIns: 0,
        scanPerSite: 0,
        totalSites: 0,
        lastCheckIn: '-',
        topSites: [],
        loaded: false
    })
    const dispatch = useDispatch()

    useEffect(() => {
        if (!sites) {
            dispatch(sitesActions.fetchSites())
        } else if (sites && !state.loaded) {
            const totalSites = sites.length
            let checkIns = 0;
            let mostRecent;

            sites.forEach((site) => {
                checkIns = checkIns + site.checkInCount
                if (!mostRecent || new Date(site.lastCheckIn) > new Date(mostRecent)) {
                    if (site.lastCheckIn !== '-') {
                        mostRecent = site.lastCheckIn
                    }
                }
            })

            const sitesCopy = [...sites]
            const topSites = sitesCopy.sort((a, b) => (a.checkInCount > b.checkInCount) ? -1 : 1)

            let scanPerSite = Math.round(checkIns / totalSites)
            if (isNaN(scanPerSite)) {
                scanPerSite = 0
            }

            setState({
                ...state,
                checkIns,
                totalSites: totalSites.toString(),
                scanPerSite,
                topSites,
                lastCheckIn: mostRecent ? mostRecent : '-',
                loaded: true
            })
        }
    }, [sites, dispatch, state])


    let currentRank = 1;
    return (
        <div className={styles.Home}>
            <h2>{name ? name : "...Loading"}</h2>
            <div className={styles.TopContainer}>
                <Square title="Check-ins today" amount={state.checkIns.toString()} />
                <Square title="Avg. Scan Per Site" amount={state.scanPerSite.toString()} />
                <Square title="Total Sites" amount={state.totalSites.toString()} />
                <Square title="Last Check-in" text={state.lastCheckIn} />
            </div>
            <Panel loading={isLoading} title="Most Visited" data={state.topSites} labels={["Code", "Check-ins today", "Rank"]} styles={styles.Panel}>
                {state.topSites.map(site => {
                    const itemArr = [site.code, site.checkInCount, currentRank]
                    currentRank++
                    if (currentRank <= 6) {
                        return (
                            <Item key={Math.random()} title={site.name} itemArr={itemArr} />
                        )
                    } else {
                        return null
                    }
                })}
            </Panel>
        </div>
    )
}

export default Home;