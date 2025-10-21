import { Animated, Easing } from 'react-native';

export const fadeIn = (animatedValue: Animated.Value, duration: number = 300) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

export const fadeOut = (animatedValue: Animated.Value, duration: number = 300) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  });
};

export const slideUp = (animatedValue: Animated.Value, duration: number = 400) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.back(1.5)),
    useNativeDriver: true,
  });
};

export const slideDown = (animatedValue: Animated.Value, duration: number = 400) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.in(Easing.back(1.5)),
    useNativeDriver: true,
  });
};

export const scaleIn = (animatedValue: Animated.Value, duration: number = 200) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  });
};

export const scaleOut = (animatedValue: Animated.Value, duration: number = 200) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  });
};

export const bounceIn = (animatedValue: Animated.Value) => {
  Animated.sequence([
    Animated.spring(animatedValue, {
      toValue: 1.2,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }),
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }),
  ]).start();
};

export const pulse = (animatedValue: Animated.Value) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ])
  ).start();
};

export const staggerAnimation = (animations: Animated.CompositeAnimation[], staggerDelay: number = 100) => {
  const sequence = animations.map((animation, index) => {
    return Animated.delay(index * staggerDelay).start(() => animation.start());
  });

  Animated.stagger(staggerDelay, animations).start();
};