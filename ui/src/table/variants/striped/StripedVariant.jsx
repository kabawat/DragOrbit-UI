import { TableSurface } from "../TableSurface";
import styles from "./StripedVariant.module.css";

export function renderStripedVariant(props) {
	return <TableSurface {...props} name="striped" className={styles.variant} />;
}
