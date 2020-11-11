import React from 'react';
import logo from '../../../assets/logo.png'

// STYLES
import styles from './QRPanel.module.css';

// EXTERNAL
import QRCode from "react-qr-code";
import { printComponent } from "react-print-tool";


const QRPanel = (props) => {

    const handlePrint = async () => {
        await printComponent(
            <div className={styles.Print}>
                <h1 className={styles.PrintH1}>Scan with phone to check in</h1>
                <QRCode value={props.code} size={500} fgColor={"rgba(46, 101, 253, 1)"} />
                <span className={styles.CodePrintText}>{props.code}</span>
                <div className={styles.BottomContainer}>
                    <img className={styles.Logo} src={logo} alt="logo" />
                    <span>ClickAttend</span>
                </div>
            </div>);

    }

    return (
        <div className={styles.Panel}>
            <div>
                <QRCode value={props.code} size={180} fgColor={"rgba(46, 101, 253, 1)"} />
            </div>
            <div className={styles.ButtonsContainer}>
                <button className={styles.Button} onClick={handlePrint} >Print</button>
                <button className={styles.Button}>Save</button>
            </div>
        </div>
    )
}

export default QRPanel;