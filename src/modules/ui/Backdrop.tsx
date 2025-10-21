import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ViewStyle, Animated } from 'react-native';
import { theme } from '../../core/theme';
import { slideUp, slideDown } from '../../core/animations';

interface BackdropProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Backdrop: React.FC<BackdropProps> = ({
  visible,
  onClose,
  children,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(1);
      slideUp(slideAnim).start();
    } else {
      slideDown(slideAnim).start();
    }
  }, [visible, slideAnim]);

  const animatedStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 600],
        }),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={[styles.content, animatedStyle, style]}>
          <View style={styles.handle} />
          <View style={styles.childrenContainer}>
            {children}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    width: '100%',
    maxHeight: '85%',
    ...theme.shadows.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  childrenContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
});