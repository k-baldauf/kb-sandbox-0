import { keyframes } from '@emotion/react';

export const pageTransitionEasing = 'cubic-bezier(0.23, 1, 0.32, 1)'; // easeOutQuint
export const commonTransition = `all ${pageTransitionEasing} 0.5s`;

export const slideUp = keyframes`
  from { transform: translate3d(0, 100vh, 0); }
  to { translate3d(0, 0, 0); }
`;

export const slideLeft = keyframes`
  from { transform: translate3d(100vh, 0, 0); }
  to { translate3d(0, 0, 0); }
`;

export const slideRight = keyframes`
  from { transform: translate3d(-100vh, 0, 0); }
  to { translate3d(0, 0, 0); }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
