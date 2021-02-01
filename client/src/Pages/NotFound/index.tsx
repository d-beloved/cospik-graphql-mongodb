import React from "react";
import { Link } from 'react-router-dom';
import Footer from "Components/Footer";
import notFound from "Assets/images/404.jpg";
import styles from "./style.module.scss";

export default function NotFound() {
  return (
    <div className={styles.here}>
      <div className={styles.notfound}>
        <div><img src={notFound} alt="Not Found" /></div>
        <p><Link to='/students'>View Students</Link></p>
      </div>
      <Footer />
    </div>
  );
}
