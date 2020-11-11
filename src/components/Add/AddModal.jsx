import React, { useCallback, useEffect, useState } from 'react';

// STYLES
import styles from './AddModal.module.css';

// COMPONENTS
import Backdrop from '../UI/Backdrop/Backdrop';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

// EXTERNAL
import QRCode from "react-qr-code";
import randomstring from "randomstring";
import Loader from 'react-loader-spinner'

// FIREBASE
import { fs } from '../../firebase/config';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import * as sitesActions from '../../store/actions/sites';

const AddModal = (props) => {
    const [code, setCode] = useState("000000")
    const [submitted, setSubmitted] = useState(false)
    const isUploading = useSelector(state => state.sites.uploading)
    const error = useSelector(state => state.sites.errorMSG)
    const [form, setForm] = useState({
        name: {
            text: '',
            valid: false
        }
    })
    const dispatch = useDispatch()

    const checkDatabase = useCallback(async (code) => {
        let empty;
        const query = fs.collection('locations').where("code", "==", code)
        await query.get()
            .then((querySnapshot) => {
                if (querySnapshot.size === 0) {
                    empty = true;
                } else {
                    empty = false;
                }
            })

        // returns true if unique
        return empty;
    }, [])


    // generate random unique number
    const generateString = useCallback(() => {
        let code = randomstring.generate(8)
        checkDatabase(code).then((result) => {
            if (!result) {
                generateString();
            } else {
                setCode(code)
            }
        })
    }, [checkDatabase])

    useEffect(() => {
        generateString()
    }, [generateString])

    const uploadSite = () => {
        if (!form.name.valid) {
            return;
        }
        dispatch(sitesActions.uploadSite(code, form.name.text))
        setSubmitted(true)
    }

    useEffect(() => {
        if (!isUploading && submitted) {
            props.refetch()
            setSubmitted(false)
            props.closeModal()
            setForm({
                name: {
                    text: '',
                    valid: false,
                }
            })
            generateString()
        }
    }, [isUploading, generateString, props, submitted])


    const inputChangeHandler = (event, id) => {
        const text = event.target.value
        const valid = text.length > 3

        setForm({
            ...form, [id]: {
                valid: valid,
                text: text
            }
        })

    }

    if (error) {
        console.log(error)
    }


    return (
        <React.Fragment>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div
                className={styles.AddModal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}
            >
                {!isUploading ? <React.Fragment><div className={styles.TopContainer}>
                    <div className={styles.Form}>
                        <h4>Site Name</h4>
                        <Input id={"name"} text={form.name.text} onChange={inputChangeHandler} placeholder="Ex. Library" height={"35px"} />
                        <div className={styles.Divider} />
                        <h4>Code</h4>
                        <span className={styles.CodeText}>{code}</span>
                    </div>
                    <div className={styles.QR}>
                        <div className={styles.QRContainer}>
                            <QRCode value={code} size={180} fgColor={"rgba(46, 101, 253, 1)"} />
                        </div>
                    </div>
                </div>
                    <div className={styles.BottomContainer} >
                        <span onClick={props.closeModal} className={styles.Span}>Cancel</span>
                        <Button formValid={form.name.valid} onClick={uploadSite}>Add</Button>
                    </div></React.Fragment> : <div style={{ marginTop: 150 }}><Loader
                        type="TailSpin"
                        color={'rgba(46, 101, 253, 1)'}
                        height={100}
                        width={100}
                    /></div>}


            </div>
        </React.Fragment>

    )
}

export default AddModal;