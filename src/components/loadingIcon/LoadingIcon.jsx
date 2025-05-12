import styles from "./LoadingIcon.module.css";

const LoadingIcon = ({ type = "pen" }) => {
    const iconClass = type === "pen" ? styles.pen : styles.cart;
    return (
        <div className={styles.loadingWrapper}>
            <span className={`${styles.loadingIcon} ${iconClass}`}>
                {type === "pen" ? "🖊" : "🛒"}
            </span>
        </div>
    );
};

export default LoadingIcon;
