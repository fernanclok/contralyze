import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import MainLayout from "../../components/MainLayout";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react";
import {fetchDepartaments, fetchCompanyData, fetchUsers} from "@/hooks/ts/manage_profile/Manage_company";
import { useNavigation, useRoute } from "@react-navigation/native";
import tw from "twrnc";

export default function CompanyManagement() {

  const navigation = useNavigation();
  //  no mostrar el header de la ruta
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);



  const [company, setCompany] = useState({ id: null, name: "", address: "" });
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "" });

  const loadData = async () => {
    const companyData = await fetchCompanyData();
    const userData = await fetchUsers();
    const departmentData = await  fetchDepartaments();
    setCompany(companyData);
    setUsers(userData);
    setDepartments(departmentData);
  };

  const handleUpdateCompany = async () => {
    await updateCompany(company);
    Alert.alert("Success", "Company information updated");
  };

  const handleUpdateUser = async (user) => {
    await updateUser(user);
    setEditingUser(null);
    await loadData();
  };

  const handleUpdateDepartment = async (department) => {
    await updateDepartment(department);
    setEditingDepartment(null);
    await loadData();
  };

  const handleAddUser = async () => {
    await addUser(newUser);
    setNewUser({ name: "", email: "" });
    await loadData();
  };

  const handleAddDepartment = async () => {
    await addDepartment(newDepartment);
    setNewDepartment({ name: "" });
    await loadData();
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    await loadData();
  };

  const handleDeleteDepartment = async (id) => {
    await deleteDepartment(id);
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);
  const renderTable = (data, columns, onEdit, onDelete) => (
    <View style={tw`border border-gray-300 rounded-md overflow-hidden`}>
      <View style={tw`flex-row bg-gray-100`}>
        {columns.map((column, index) => (
          <View key={index} style={tw`flex-1 p-2 border-r border-gray-300`}>
            <Text style={tw`font-bold`}>{column.title}</Text>
          </View>
        ))}
        <View style={tw`w-20 p-2`}>
          <Text style={tw`font-bold`}>Actions</Text>
        </View>
      </View>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <View key={item.id} style={tw`flex-row border-t border-gray-300`}>
            {columns.map((column, index) => (
              <View key={index} style={tw`flex-1 p-2 border-r border-gray-300`}>
                <Text>{item[column.key]}</Text>
              </View>
            ))}
            <View style={tw`w-20 p-2 flex-row justify-around`}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={tw`text-blue-500`}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={tw`text-red-500`}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={tw`flex-row border-t border-gray-300`}>
          <Text>No data available</Text>
        </View>
      )}
    </View>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <ScrollView style={tw`flex-1 p-4`}>
          <Text style={tw`text-2xl font-bold mb-4`}>Company Management</Text>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-2`}>Company Information</Text>
            <View style={tw`border border-gray-300 rounded-md p-2 mb-2`}>
              <TextInput
                style={tw`p-2 mb-2`}
                value={company.name}
                onChangeText={(text) => setCompany({ ...company, name: text })}
                placeholder="Company Name"
              />
              <TextInput
                style={tw`p-2 mb-2`}
                value={company.address}
                onChangeText={(text) => setCompany({ ...company, address: text })}
                placeholder="Company Address"
              />
              <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-md`} onPress={handleUpdateCompany}>
                <Text style={tw`text-white text-center`}>Update Company Info</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-2`}>Users</Text>
            {renderTable(
              users,
              [
                { title: "Name", key: "name" },
                { title: "Email", key: "email" },
              ],
              setEditingUser,
              handleDeleteUser,
            )}
            {editingUser && (
              <View style={tw`mt-2 border border-gray-300 rounded-md p-2`}>
                <TextInput
                  style={tw`p-2 mb-2`}
                  value={editingUser.name}
                  onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
                  placeholder="User Name"
                />
                <TextInput
                  style={tw`p-2 mb-2`}
                  value={editingUser.email}
                  onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
                  placeholder="User Email"
                />
                <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={() => handleUpdateUser(editingUser)}>
                  <Text style={tw`text-white text-center`}>Update User</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={tw`mt-2 border border-gray-300 rounded-md p-2`}>
              <TextInput
                style={tw`p-2 mb-2`}
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                placeholder="New User Name"
              />
              <TextInput
                style={tw`p-2 mb-2`}
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                placeholder="New User Email"
              />
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={handleAddUser}>
                <Text style={tw`text-white text-center`}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-semibold mb-2`}>Departments</Text>
            {renderTable(departments, [{ title: "Name", key: "name" }, {title:"Description", key: "description"}], setEditingDepartment, handleDeleteDepartment)}
            {editingDepartment && (
              <View style={tw`mt-2 border border-gray-300 rounded-md p-2`}>
                <TextInput
                  style={tw`p-2 mb-2`}
                  value={editingDepartment.name}
                  onChangeText={(text) => setEditingDepartment({ ...editingDepartment, name: text })}
                  placeholder="Department Name"
                />
                <TouchableOpacity
                  style={tw`bg-green-500 p-2 rounded-md`}
                  onPress={() => handleUpdateDepartment(editingDepartment)}
                >
                  <Text style={tw`text-white text-center`}>Update Department</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={tw`mt-2 border border-gray-300 rounded-md p-2`}>
              <TextInput
                style={tw`p-2 mb-2`}
                value={newDepartment.name}
                onChangeText={(text) => setNewDepartment({ ...newDepartment, name: text })}
                placeholder="New Department Name"
              />
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={handleAddDepartment}>
                <Text style={tw`text-white text-center`}>Add Department</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </MainLayout>
    </ProtectedRoute>
  );
}

