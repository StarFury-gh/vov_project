import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './AppButton.module.css';

type ButtonVariant = 'primary' | 'secondary';
type ButtonVisualState = 'default' | 'hover' | 'pressed' | 'selected' | 'disabled';

type CommonProps = {
    children: ReactNode;
    variant?: ButtonVariant;
    selected?: boolean;
    showChevrons?: boolean;
    icon?: ReactNode;
    className?: string;
    visualState?: ButtonVisualState;
};

type AppButtonProps = CommonProps & {
    to?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

function AppButton({
    children,
    variant = 'secondary',
    selected = false,
    showChevrons = false,
    icon,
    className,
    visualState = 'default',
    to,
    disabled,
    type = 'button',
    ...buttonProps
}: AppButtonProps) {
    const isDisabled = disabled || visualState === 'disabled';
    const isSelected = selected || visualState === 'selected';

    let stateClass = '';
    if (visualState === 'hover') {
        stateClass = styles.isHover;
    } else if (visualState === 'pressed') {
        stateClass = styles.isPressed;
    }

    const classNames = [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        isSelected ? styles.selected : '',
        isDisabled ? styles.disabled : '',
        stateClass,
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <>
            {showChevrons ? <span className={styles.chevron} aria-hidden="true" /> : null}
            {icon ? <span className={styles.icon}>{icon}</span> : null}
            <span className={styles.label}>{children}</span>
            {showChevrons ? <span className={styles.chevron} aria-hidden="true" /> : null}
        </>
    );

    if (to && !isDisabled) {
        return (
            <Link to={to} className={classNames}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} className={classNames} disabled={isDisabled} {...buttonProps}>
            {content}
        </button>
    );
}

export default AppButton;
