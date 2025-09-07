import React from 'react';
import styles from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isSelected?: boolean;
  isDisabled?: boolean;
}

export default function Button({ children, isSelected, isDisabled, ...rest }: Props) {
  const className = [
    styles.button,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
  ].filter(Boolean).join(' ');

  return <button 
    {...rest}
    className={className}
    disabled={isDisabled}
  >
    {children}
  </button>;
}
