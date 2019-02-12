import React, { Component } from 'react';
import styles from './styles.scss';

const checkoutButton = () => {
  return <button className={styles.button}><i className={styles.button__icon}></i><span>Add to Cart</span></button>;
};

export default checkoutButton;
