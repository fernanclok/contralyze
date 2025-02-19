import { View, Text, FlatList, Pressable, ScrollView } from "react-native"
import { getClients } from "../../../hooks/ts/clients/newClient";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react"
import { Feather } from "@expo/vector-icons"
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

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const clientsData = await getClients();
            setClients(clientsData.clients || []);
            setError(null);
        } catch (err) {
            setError("Error al cargar los clientes");
            console.error(err);
        }
    };

    const renderClientItem = ({ item }: { item: Client }) => (
        <View style={tw`bg-white rounded-lg shadow-md p-4 mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
            <Text style={tw`text-sm text-gray-600`}>{item.email}</Text>
            <Text style={tw`text-sm text-gray-600`}>{item.phone}</Text>
            <Text style={tw`text-sm text-gray-600`}>{item.address}</Text>
        </View>
    );


    return (
        <ProtectedRoute>
            <MainLayout>
                    <View style={tw`flex-1 p-4 mt-22 mb-22`}>
                        <Text style={tw`text-2xl font-bold mb-4 text-indigo-700`}>Lista de Clientes</Text>
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

