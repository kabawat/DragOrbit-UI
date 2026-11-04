"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import styles from "./style.module.scss";

const ThermalMinimalTemplate = ({ invoiceData, selectedStore }) => {
    const settings = useInvoicePrintContext()?.settings || {};
    const showDescription = settings.showDescription !== false;
    return (
        <MiniInvoiceContainer>
            <div className={styles.thermalInvoice}>
                <div className={styles.top}>
                    <h1 data-invoice-company-name>{selectedStore?.storeName}</h1>
                    <p>{formatInvoiceDate(invoiceData.createdAt, "DD/MM/YY")}</p>
                </div>

                <div className={styles.items}>
                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <span>{item.quantity} x {item.product?.name}{showDescription && (item.description || item.product?.description) && <small data-invoice-item-description>{item.description || item.product.description}</small>}{settings.showMrp && item.mrp != null && <small data-invoice-item-mrp>MRP: ₹{Number(item.mrp).toLocaleString("en-IN")}</small>}</span>
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
