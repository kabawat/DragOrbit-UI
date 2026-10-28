"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import styles from "./style.module.scss";

const ThermalModernTemplate = ({ invoiceData, selectedStore }) => {
    const formatCurrency = (amount) => {
        return `₹${(amount || 0).toFixed(2)}`;
    };

    return (
        <MiniInvoiceContainer>
            <div className={styles.thermalInvoice}>
                <div className={styles.header}>
                    <div data-invoice-logo className={styles.logoContainer}>DB</div>
                    <div className={styles.storeName}>{selectedStore?.storeName || "MODERN STORE"}</div>
                    <p style={{ fontSize: '8pt' }}>{selectedStore?.address}</p>
                </div>

                <div className={styles.infoBlock}>
                    <div className={styles.row}>
                        <span className={styles.label}>Invoice</span>
                        <span className={styles.value}>#{invoiceData.invoiceNumber}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Date</span>
                        <span className={styles.value}>{formatInvoiceDate(invoiceData.createdAt, "MMM DD, YYYY")}</span>
                    </div>
                </div>

                <div className={styles.items}>
                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.left}>
                                <span className={styles.name}>{item.product?.name}</span>
                                <span className={styles.meta}>{item.quantity} x {formatCurrency(item.price)}</span>
                            </div>
                            <div className={styles.right}>
                                {formatCurrency(item.calculatedTotal || (item.quantity * item.price))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.totals}>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>{formatCurrency(invoiceData.subtotal)}</span>
                    </div>
                    {invoiceData.gstAmount > 0 && (
                        <div className={styles.row}>
                            <span>GST</span>
                            <span>{formatCurrency(invoiceData.gstAmount)}</span>
                        </div>
                    )}
                    <div className={`${styles.row} ${styles.grandTotal}`}>
                        <span>TOTAL</span>
                        <span>{formatCurrency(invoiceData.totalAmount)}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.barcode} />
                    <p>Thanks for choosing us!</p>
                    <p>Visit again for more offers.</p>
                </div>
            </div>
        </MiniInvoiceContainer>
    );
};

export default ThermalModernTemplate;
