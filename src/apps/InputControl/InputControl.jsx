import React from "react";
import styles from "./ImputControl.module.css";

export function InputControl(props) {
	return (
		<div className={styles.container}>
			{props.label && <label>{props.label}</label>}
			<input type="text" {...props}></input>
		</div>)
}