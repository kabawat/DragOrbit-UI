import styles from "./TableSurface.module.css";

export function TableSurface({
	children,
	caption,
	className = "",
	name,
}) {
	return (
		<section
			className={`${styles.scroller} ${className}`}
			{...{ tabIndex: 0 }}
			aria-label={caption}
			data-table-variant={name}
		>
			{children}
		</section>
	);
}
