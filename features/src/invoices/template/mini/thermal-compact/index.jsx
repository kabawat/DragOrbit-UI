"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import styles from "./style.module.scss";

const ThermalCompactTemplate = ({ invoiceData, selectedStore }) => {
    const settings = useInvoicePrintContext()?.settings || {};
    const showDescription = settings.showDescription !== false;
    const formatCurrency = (amount) => {
        return `₹${Math.round(amount)}`;
    };

    return (
        <MiniInvoiceContainer pageWidth="58mm">
            <div className={styles.thermalInvoice}>
                <div className={styles.header}>
                    <strong>{selectedStore?.storeName}</strong>
                    <span>{formatInvoiceDate(invoiceData.createdAt, "DD/MM/YY HH:mm")}</span>
                </div>

                <div className={styles.line}></div>

                <div className={styles.items}>
                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.top}>
                                <span className={styles.name}>{item.product?.name}</span>
                                <span className={styles.total}>{formatCurrency(item.calculatedTotal || (item.quantity * item.price))}</span>
                            </div>
                            <div className={styles.bottom}>
                                {item.quantity} x {item.price}
                            </div>
                            {showDescription && (item.description || item.product?.description) && <small data-invoice-item-description>{item.description || item.product.description}</small>}
                            {settings.showMrp && item.mrp != null && <small data-invoice-item-mrp>MRP: {formatCurrency(item.mrp)}</small>}
                        </div>
                    ))}
                </div>

                <div className={styles.line}></div>

                <div className={styles.totals}>
                    <div className={styles.row}>
                        <strong>TOTAL:</strong>
                        <strong>{formatCurrency(invoiceData.totalAmount)}</strong>
                    </div>
                </div>

                <div className={styles.smFooter}>
                    Inv: {invoiceData.invoiceNumber}
                </div>
            </div>
        </MiniInvoiceContainer>
    );
};

export default ThermalCompactTemplate;
