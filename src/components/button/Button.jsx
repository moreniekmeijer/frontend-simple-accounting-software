import styles from './Button.module.css';

function Button({ variant = "primary", className, onClick, disabled, children }) {
    const variantClass = styles[variant] || "";

    const buttonClass = `${styles.button} ${variantClass} ${className || ""}`.trim();

    return (
        <button className={buttonClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;
