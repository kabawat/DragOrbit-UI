"use client";
import styles from "./StartupLoader.module.css";

/** App/session bootstrap only. Data-loading placeholders belong inside the page. */
export function StartupLoader({ title, description }) {
	return (
		<section
			className={styles.screen}
			aria-busy="true"
			aria-label="Loading DragBizz"
		>
			<div className={styles.content}>
				<div className={styles.orbit} aria-hidden="true">
					<span className={styles.track} />
					<span className={styles.ring} />
					<img
						className={styles.light}
						src="/DragBizz-Logos/Dragbizz-black.svg"
						alt=""
						width="112"
						height="36"
					/>
					<img
						className={styles.dark}
						src="/DragBizz-Logos/Dragbizz-white.svg"
						alt=""
						width="112"
						height="36"
					/>
				</div>
				{title && <h2 className={styles.title}>{title}</h2>}
				{description && <p className={styles.description}>{description}</p>}
				<output className="sr-only">Loading DragBizz</output>
			</div>
		</section>
	);
}
