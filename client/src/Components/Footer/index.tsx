import React from "react";
import styles from "./style.module.scss";

export default function Footer() {
  return (
    <div className={styles.foot}>
      &copy;{" "}
      <a href="https://github.com/d-beloved" target="_blank" rel="noreferrer">
        Ayodeji
      </a>{" "}
      {new Date().getFullYear()}
    </div>
  );
}
