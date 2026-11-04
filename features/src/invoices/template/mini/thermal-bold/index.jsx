"use client";
import React from 'react';
import { formatInvoiceDate } from "../../formatInvoiceDate.js";
import MiniInvoiceContainer from "../MiniInvoiceContainer";
import { useInvoicePrintContext } from "../../InvoicePrintSettingsContext.jsx";
import styles from "./style.module.scss";

const ThermalBoldTemplate = ({ invoiceData, selectedStore }) => {
    const settings = useInvoicePrintContext()?.settings || {};
    const showDescription = settings.showDescription !== false;
    return (
        <MiniInvoiceContainer>
            <div className={styles.thermalInvoice}>
                <div className={styles.header}>
                    <div className={styles.store}>{selectedStore?.storeName}</div>
                    <div className={styles.title}>CASH MEMO</div>
                </div>

                <div className={styles.info}>
                    <div>NO: {invoiceData.invoiceNumber}</div>
                    <div>DATE: {formatInvoiceDate(invoiceData.createdAt, "DD-MM-YYYY")}</div>
                </div>

                <div className={styles.itemsHeader}>
                    <span>ITEM</span>
                    <span>PRICE</span>
                </div>

                <div className={styles.items}>
                    {invoiceData.items?.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.name}>{item.product?.name}{showDescription && (item.description || item.product?.description) && <small data-invoice-item-description>{item.description || item.product.description}</small>}{settings.showMrp && item.mrp != null && <small data-invoice-item-mrp>MRP: ₹{Number(item.mrp).toLocaleString("en-IN")}</small>}</div>
                            <div className={styles.priceRow}>
                                <span>{item.quantity} PCS</span>
                                <span>{Math.round(item.calculatedTotal || (item.quantity * item.price))}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.totalBlock}>
                    <div className={styles.label}>TOTAL PAYABLE</div>
                    <div className={styles.amount}>₹{Math.round(invoiceData.totalAmount)}</div>
                </div>

                <div className={styles.footer}>
                    *** THANK YOU ***
                </div>
            </div>
        </MiniInvoiceContainer>
    );
};

export default ThermalBoldTemplate;
