import { PaperDocument } from "@dragorbit/ui";
import { ResponsiveInvoiceDocument } from "../component/view/ResponsiveInvoiceDocument.jsx";
import styles from "./style.module.scss";

const InvoiceContainer = ({ children, className = "", style = {} }) => {
	return (
		<>
			<style>{`
        @media print {
          @page {
            size: A4;
            margin: 0 !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide default browser headers/footers just in case */
          header, footer {
            display: none !important; 
          }
        }
      `}</style>
			<ResponsiveInvoiceDocument pageWidth={794}>
				<PaperDocument
					id="invoice-container"
					className={`${styles.invoicePage} ${className}`}
					style={style}
				>
					{children}
				</PaperDocument>
			</ResponsiveInvoiceDocument>
		</>
	);
};

export default InvoiceContainer;
