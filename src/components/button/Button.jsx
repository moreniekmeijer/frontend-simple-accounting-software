import styles from './Button.module.css';

function Button({ type = "button", variant = "primary", className, onClick, disabled, children }) {
    const variantClass = styles[variant] || "";

    const buttonClass = `${styles.button} ${variantClass} ${className || ""}`.trim();

    return (
        <button type={type} className={buttonClass} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;
