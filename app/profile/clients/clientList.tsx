import { getClients, deleteClient, updateClient } from "../../../hooks/ts/clients/newClient";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native"
import  Modal_delete  from "../../components/Modal_delete";
import Modal_Update from "../../components/Modal_update";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { Feather } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useNavigation } from "expo-router";
import tw from "twrnc"

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}


const ClientList = () => {
    
    const [clients, setClients] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [modalDVisible, setModalDVisible] = useState(false);
    const [modalUVisible, setModalUVisible] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<Client | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    
    const navigation = useNavigation();

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDeleteClient = async (id: string) => {
        if(selectedClientId){
        try {
            await deleteClient(selectedClientId);
            fetchClients();
            setModalDVisible(false);
        } catch (err) {
            console.error(err);
        }
    }
    }

    const handleUpdateClient = async (updatedClient : Client) =>{
        if(selectedClient){
            try{

                await updateClient(updatedClient.id ,updatedClient.name, updatedClient.email, updatedClient.phone, updatedClient.address,navigation )

                fetchClients();
                setModalUVisible(false);

            }
            catch(err){
                console.error(err)
            }
        }
    }

    const fetchClients = async () => {
        try {
            const clientsData = await getClients();
            setClients(clientsData || []);
            setError(null);
        } catch (err) {
            setError("Error al cargar los clientes");
            console.error(err);
        }
    };




    const renderClientItem = ({ item }: { item: Client }) => (
        <View style={tw`bg-gray-200 rounded-lg shadow-lg p-4 mb-4 flex-col justify-center items-center`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
            <View style={tw`flex-col justify-center items-center mt-4`}>
                    <Text style={tw`font-bold mb-2 text-base`}>Email</Text>
                   <Text style={tw`text-sm text-gray-600`}>{item.email}</Text>
                </View>
            <View style={tw`flex-row justify-between w-full py-4 `}>
                <View style={tw`flex-col justify-center items-center`}>
                    <Text style={tw`font-bold mb-2 text-base`}>Phone</Text>
                    <Text style={tw`text-sm text-gray-600`}>{item.phone}</Text>
                </View>
                <View style={tw`flex-col justify-center items-end`}>
                    <Text style={tw`font-bold mb-2 text-base`}>Address</Text>
                    <Text style={tw`text-sm text-gray-600`}>{item.address}</Text>
                </View>
            </View>
            <View style={tw`flex-row justify-between  w-full`}>
                <Pressable onPress={() => {setSelectedClient(item); setModalUVisible(true)}}>
                    <Feather name="edit" size={24} color="blue" />
                </Pressable>
                <Pressable onPress={() => { setSelectedClientId(item.id); setModalDVisible(true); }}>
                    <Feather name="trash-2" size={24} color="red" />
                </Pressable>
            </View>
            <Modal_delete
                visible={modalDVisible}
                onDelete={handleDeleteClient}
                onClose={() => setModalDVisible(false)}
            />
            <Modal_Update
                visible={modalUVisible}
                client={selectedClient}
                onUpdate={handleUpdateClient}
                onClose={() => setModalUVisible(false)}
            />
        </View>
    );


    return (
        <ProtectedRoute>
            <MainLayout>
                    <View style={tw`flex-1 p-4 mt-22 mb-22`}>
                        <Text style={tw`text-2xl font-bold mb-4 text-blue-700`}>Client List</Text>
                        <ScrollView contentContainerStyle={tw`pb-4`}>
                        <FlatList
                            data={clients}
                            renderItem={renderClientItem}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={<Text style={tw`text-center text-gray-500`}>No hay clientes para mostrar</Text>}
                        />
                        </ScrollView>
                        <Pressable
                            style={tw`bg-indigo-600 py-3 px-4 rounded-full shadow-md absolute bottom-4 right-4`}
                            onPress={fetchClients}
                        >
                            <Feather name="refresh-cw" size={24} color="white" />
                        </Pressable>
                    </View>
                    
                    
        </MainLayout>
        </ProtectedRoute>
    );
};
export default ClientList

