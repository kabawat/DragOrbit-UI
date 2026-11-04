import { TableSurface } from "../TableSurface";
import styles from "./DefaultVariant.module.css";

export function renderDefaultVariant(props) {
	return <TableSurface {...props} name="default" className={styles.variant} />;
}
