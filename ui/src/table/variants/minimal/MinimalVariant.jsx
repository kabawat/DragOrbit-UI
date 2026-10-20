import { TableSurface } from "../TableSurface";
import styles from "./MinimalVariant.module.css";

export function renderMinimalVariant(props) {
	return <TableSurface {...props} name="minimal" className={styles.variant} />;
}
