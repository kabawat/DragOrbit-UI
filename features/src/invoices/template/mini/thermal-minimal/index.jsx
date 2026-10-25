"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import styles from "./style.module.scss";

const ThermalMinimalTemplate = ({ invoiceData, selectedStore }) => {
    return (
        <MiniInvoiceContainer>
            <div className={styles.thermalInvoice}>
                <div className={styles.top}>
                    <h1>{selectedStore?.storeName}</h1>
                    <p>{formatInvoiceDate(invoiceData.createdAt, "DD/MM/YY")}</p>
                </div>

                <div className={styles.items}>
                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <span>{item.quantity} x {item.product?.name}</span>
                            <span>{(item.calculatedTotal || (item.quantity * item.price)).toFixed(0)}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.totalSection}>
                    <div className={styles.totalRow}>
                        <span>Total Amount</span>
                        <span>₹{invoiceData.totalAmount.toFixed(0)}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    #{invoiceData.invoiceNumber}
                </div>
            </div>
        </MiniInvoiceContainer>
    );
};

export default ThermalMinimalTemplate;
