"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import styles from "./style.module.scss";

const ThermalClassicTemplate = ({ invoiceData, selectedStore }) => {
    const formatCurrency = (amount) => {
        return `₹${(amount || 0).toFixed(2)}`;
    };

    return (
        <MiniInvoiceContainer className={styles.container}>
            <div className={styles.thermalInvoice}>
                <div className={styles.header}>
                    <div className={styles.storeName}>{selectedStore?.storeName || "STORE NAME"}</div>
                    <p>{selectedStore?.address || "Store Address"}</p>
                    {selectedStore?.phone && <p>Ph: {selectedStore.phone}</p>}
                    <div className={styles.divider}></div>
                    <h2>INVOICE</h2>
                </div>

                <div className={styles.info}>
                    <p><strong>Inv No:</strong> {invoiceData.invoiceNumber}</p>
                    <p><strong>Date:</strong> {formatInvoiceDate(invoiceData.createdAt, "DD/MM/YYYY HH:mm")}</p>
                    <p><strong>Customer:</strong> {invoiceData.customer?.name || "Walk-in"}</p>
                </div>

                <div className={styles.divider}></div>

                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style={{ textAlign: 'right' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.items?.map((item, index) => (
                            <tr key={index} className={styles.itemRow}>
                                <td>
                                    <div className={styles.productName}>{item.product?.name}</div>
                                    <div className={styles.details}>@{formatCurrency(item.price)}</div>
                                </td>
                                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(item.calculatedTotal || (item.quantity * item.price))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.divider}></div>

                <div className={styles.totals}>
                    <div className={styles.totalRow}>
                        <span>Subtotal:</span>
                        <span>{formatCurrency(invoiceData.subtotal)}</span>
                    </div>
                    {invoiceData.gstAmount > 0 && (
                        <div className={styles.totalRow}>
                            <span>GST:</span>
                            <span>{formatCurrency(invoiceData.gstAmount)}</span>
                        </div>
                    )}
                    {invoiceData.totalDiscount > 0 && (
                        <div className={styles.totalRow}>
                            <span>Discount:</span>
                            <span>-{formatCurrency(invoiceData.totalDiscount)}</span>
                        </div>
                    )}
                    <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                        <span>TOTAL:</span>
                        <span>{formatCurrency(invoiceData.totalAmount)}</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <p>THANK YOU FOR SHOPPING!</p>
                    <p>Please visit again.</p>
                </div>
            </div>
        </MiniInvoiceContainer>
    );
};

export default ThermalClassicTemplate;
