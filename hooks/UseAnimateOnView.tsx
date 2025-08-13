import { useInView } from "react-intersection-observer";

/**
 * Returns boolean indicating if element is in view.
 */
export function useAnimateOnView(threshold = 0.01, delay = 0.5) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    delay
  });
  return { ref, animate: inView };
}