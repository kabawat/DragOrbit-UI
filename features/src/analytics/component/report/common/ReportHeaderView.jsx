"use client";
export function ReportHeaderView({ model }) {
  const { styles, selectedStore, title, moment, lastSyncedAt } = model;
  return (
    <div className={styles.header}>
      <div className={styles.storeDetails}>
        <div className={styles.storeName}>
          {selectedStore?.storeName || "STORE NAME"}
        </div>
        <p>
          {selectedStore?.address || "Store Address"} <br />
          {selectedStore?.phone && `Tel: ${selectedStore.phone}`} <br />
          {selectedStore?.email && `Contact: ${selectedStore.email}`}
        </p>
      </div>
      <div className={styles.reportTitleBox}>
        <h1>{title}</h1>
        <p>Report Generated: {moment().format("DD/MM/YYYY HH:mm:ss")}</p>
        {lastSyncedAt && (
          <p>
            Data Synced: {moment(lastSyncedAt).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        )}
      </div>
    </div>
  );
}
