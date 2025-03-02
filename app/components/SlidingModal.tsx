import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import tw from 'twrnc';

const SlidingModal = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Adjust the output range as needed
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <TouchableWithoutFeedback>
            <Animated.View style={[tw`bg-white p-6 rounded-t-lg shadow-lg`, { transform: [{ translateY: slideUp }] }]}>
              {children}
              <TouchableOpacity style={tw`mt-4 bg-gray-300 p-2 rounded-md`} onPress={onClose}>
                <Text style={tw`text-center text-black`}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SlidingModal;