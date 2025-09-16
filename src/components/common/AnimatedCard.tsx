import React, { useState } from 'react';
import { ANIMATION_CLASSES, INTERACTIVE_STATES } from '../../constants/animations';
import { FOCUS_CLASSES } from '../../constants/accessibility';

interface AnimatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  animationType?: 'fadeIn' | 'slideIn' | 'scaleIn';
  interactive?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onClick,
  className = '',
  animationType = 'fadeIn',
  interactive = true,
  ariaLabel,
  ariaDescription,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const baseClasses = [
    ANIMATION_CLASSES[animationType],
    interactive && onClick ? INTERACTIVE_STATES.hover : '',
    interactive && onClick ? FOCUS_CLASSES.card : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  const cardProps = {
    className: baseClasses,
    onClick: onClick ? handleClick : undefined,
    onKeyDown: onClick ? handleKeyDown : undefined,
    tabIndex: onClick ? 0 : undefined,
    role: onClick ? 'button' : undefined,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescription ? `${ariaDescription}-desc` : undefined,
  };

  return (
    <div {...cardProps}>
      {children}
      {ariaDescription && (
        <div id={`${ariaDescription}-desc`} className="sr-only">
          {ariaDescription}
        </div>
      )}
    </div>
  );
};

export default AnimatedCard;