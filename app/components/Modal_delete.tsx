import { Modal, View, Text, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tw from "twrnc";

interface ModalDeleteProps {
  visible: boolean;
  onDelete: () => void;
  onClose: () => void;
  message?: string;
  deleteLabel?: string;
  cancelLabel?: string;
}

function Modal_delete({ 
    visible, 
    onDelete, 
    onClose, 
    message ,
    deleteLabel = "Delete", 
    cancelLabel = "Cancel"
  }: ModalDeleteProps) {
  return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white w-11/12 p-4 rounded-lg`}>
            <Text style={tw`text-center text-lg font-bold mb-4`}>{message}</Text>
            <View style={tw`flex-row justify-between p-8 gap-4`}> 
              <Pressable
                style={tw`bg-red-500 w-1/2 p-2 rounded-lg`}
                onPress={onDelete}
              >
                <Text style={tw`text-center text-white font-bold`}>{deleteLabel}</Text>
              </Pressable>
              <Pressable
                style={tw`bg-gray-500 w-1/2 p-2 rounded-lg`}
                onPress={onClose}
              >
                <Text style={tw`text-center text-white font-bold`}>{cancelLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
  );
};

export default Modal_delete;