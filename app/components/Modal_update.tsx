import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { useState, useEffect } from "react";
import tw from "twrnc";

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface ModalUpdateProps {
    visible: boolean;
    client: Client | null;
    onUpdate: (client: Client) => void;
    onClose: () => void;
}

const Modal_Update: React.FC<ModalUpdateProps> = ({
    visible,
    client,
    onUpdate,
    onClose,
}) => {
    const [name, setName] = useState(client?.name || "");
    const [email, setEmail] = useState(client?.email || "");
    const [phone, setPhone] = useState(client?.phone || "");
    const [address, setAddress] = useState(client?.address || "");

    useEffect(() => {
        if (client) {
            setName(client.name);
            setEmail(client.email);
            setPhone(client.phone);
            setAddress(client.address);
        }
    }, [client]);

    const handleUpdate = () => {
        if (client) {
            onUpdate({ ...client, name, email, phone, address });
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                <View style={tw`bg-white w-11/12 p-4 rounded-lg`}>
                    <Text style={tw`text-center text-lg font-bold mb-4`}>Actualizar Cliente</Text>
                    <TextInput
                        style={tw`border p-2 mb-4 rounded-lg`}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={tw`border p-2 mb-4 rounded-lg`}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={tw`border p-2 mb-4 rounded-lg`}
                        placeholder="Phone"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <TextInput
                        style={tw`border p-2 mb-4 rounded-lg`}
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <View style={tw`flex-row justify-between p-8 gap-4`}>
                        <Pressable
                            style={tw`bg-blue-500 w-1/2 p-2 rounded-lg`}
                            onPress={handleUpdate}
                        >
                            <Text style={tw`text-center text-white font-bold`}>Update Client</Text>
                        </Pressable>
                        <Pressable
                            style={tw`bg-gray-500 w-1/2 p-2 rounded-lg`}
                            onPress={onClose}
                        >
                            <Text style={tw`text-center text-white font-bold`}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Modal_Update;