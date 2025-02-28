import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  fetchDepartaments,
  fetchCompanyData,
  fetchUsers,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addUser
} from "@/hooks/ts/manage_profile/Manage_company";
import { useNavigation } from "@react-navigation/native";
import  Modal_delete  from "../../components/Modal_delete";
import MainLayout from "../../components/MainLayout";
import { Picker } from "@react-native-picker/picker";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react";
import tw from "twrnc";

export default function CompanyManagement() {
  
  const navigation = useNavigation();
  const [modalDVisible, setModalDVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [company, setCompany] = useState({ id: null, name: "", address: "" });
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newUser, setNewUser] = useState({ first_name: "",last_name:"", email: "", password: "", department_id:"", role: "" });
  const [newDepartment, setNewDepartment] = useState({ department_name: "", department_description: "" });

  
  
  
  //  no mostrar el header de la ruta
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  const loadData = async () => {
    const companyData = await fetchCompanyData();
    const userData = await fetchUsers();
    const departmentData = await  fetchDepartaments();
      setCompany(companyData);
      setUsers(userData);
      setDepartments(departmentData);
  };

  const handleUpdateCompany = async () => {
    // await updateCompany(company);
    // Alert.alert("Success", "Company information updated");
  };

  const handleUpdateUser = async (user) => {
    // await updateUser(user);
    // setEditingUser(null);
    // await loadData();
  };

  
  const handleAddUser = async () => {
    await addUser(newUser);
    setNewUser({ first_name: "",last_name:"", email: "", password: "", department_id:"", role: ""});
    await loadData();
  };
  
  const handleDeleteUser = async (id) => {
    // await deleteUser(id);
    // await loadData();
  };
  const handleAddDepartment = async () => {
    await addDepartment(newDepartment);
    setNewDepartment({ department_name: "" , department_description: ""});
    await loadData();
  };

  const handleUpdateDepartment = async (department) => {
    await updateDepartment(department);
    setEditingDepartment(null);
    await loadData();
  };
  
  const handleDeleteDepartment = async () => {
    if (itemToDelete) {
      try {
        await deleteDepartment(itemToDelete);
        setModalDVisible(false);
        setItemToDelete(null);
        await loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const confirmDelete = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setModalDVisible(true);
  };

  useEffect(() => {
    loadData();
  }, []);
  const renderTable = (data, columns, onEdit, onDelete) => (
    <View style={tw`border border-gray-300 rounded-lg overflow-hidden mb-6`}>
      <View style={tw`flex-row bg-gray-200 border-b border-gray-300`}>
        {columns.map((column, index) => (
          <View key={index} style={tw`flex-1 p-3`}>
            <Text style={tw`font-bold text-gray-700`}>{column.title}</Text>
          </View>
        ))}
        <View style={tw`w-24 p-3`}>
          <Text style={tw`font-bold text-gray-700`}>Actions</Text>
        </View>
      </View>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <View key={item.id} style={tw`flex-row border-b border-gray-300`}>
            {columns.map((column, index) => (
              <View key={index} style={tw`flex-1 p-3`}>
                <Text>{item[column.key]}</Text>
              </View>
            ))}
            <View style={tw`w-24 p-3 flex-row justify-around`}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={tw`text-blue-500`}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.id, 'department')}>
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
        <ScrollView style={tw`flex-1  py-24`}>
          <Text style={tw`text-3xl font-bold mb-4`}>Company Management</Text>

          <View style={tw`m-6`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Company Information</Text>
            <View style={tw`bg-white rounded-lg p-4 mb-6`}>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={company.name}
                onChangeText={(text) => setCompany({ ...company, name: text })}
                placeholder="Company Name"
              />
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={company.address}
                onChangeText={(text) => setCompany({ ...company, address: text })}
                placeholder="Company Address"
              />
              <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-md`} onPress={handleUpdateCompany}>
                <Text style={tw`text-white text-center font-semibold`}>Update Company Info</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`m-6`}>
            <Text style={tw`text-2xl font-semibold mb-4`}>Users</Text>
            {renderTable(
              users,
              [
                { title: "Name", key: "first_name" },
                { title: "Email", key: "email" },
                { title: "Role", key: "role" },
              ],
              setEditingUser,
              (id) => confirmDelete(id, 'user')
            )}
            {editingUser && (
              <View style={tw`m-6`}>
                <Text style={tw`text-lg font-semibold mb-4`}>Edit User</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                  value={editingUser.first_name}
                  onChangeText={(text) => setEditingUser({ ...editingUser, first_name: text })}
                  placeholder="User Name"
                />
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                  value={editingUser.email}
                  onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
                  placeholder="User Email"
                />
                <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-md`} onPress={() => handleUpdateUser(editingUser)}>
                  <Text style={tw`text-white text-center font-semibold`}>Update User</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={tw`m-6`}>
              <Text style={tw`text-lg font-semibold mb-4`}>Add User</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newUser.first_name}
                onChangeText={(text) => setNewUser({ ...newUser, first_name: text })}
                placeholder="New User Name"
              />
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newUser.last_name}
                onChangeText={(text) => setNewUser({ ...newUser, last_name: text })}
                placeholder="New User Last Name"
              />
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                placeholder="New User Email"
              />
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newUser.password}
                onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                placeholder="New User Password"
              />
              
              <Picker
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                selectedValue={newUser.department_id}
                onValueChange={(itemValue, itemIndex) =>
                  setNewUser({ ...newUser, department_id: itemValue })
                }
              >
                {departments.map((department) => (
                  <Picker.Item key={department.id} label={department.name} value={department.id} />
                ))}
              </Picker>
              <Picker
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                selectedValue={newUser.role}
                onValueChange={(itemValue, itemIndex) =>
                  setNewUser({ ...newUser, role: itemValue })
                }
              >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
              
              </Picker>
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={handleAddUser}>
                <Text style={tw`text-white text-center`}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`m-6`}>
            <Text style={tw`text-xl font-semibold mb-2`}>Departments</Text>
            {renderTable(departments, [{ title: "Name", key: "name" }, {title:"Description", key: "description"}], setEditingDepartment, (id) => confirmDelete(id, 'department'))}
            {editingDepartment && (
              <View style={tw`m-6`}>
                <Text style={tw`text-lg font-semibold mb-4`}>Edit Department</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                  value={editingDepartment.name || ""}
                  onChangeText={(text) => setEditingDepartment({ ...editingDepartment, name: text })}
                  placeholder="Department Name"
                />
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                  value={editingDepartment.description || ""}
                  onChangeText={(text) => setEditingDepartment({ ...editingDepartment, description: text })}
                  placeholder="Department Description"
                />
                <TouchableOpacity
                  style={tw`bg-blue-500 p-2 rounded-md`}
                  onPress={() => handleUpdateDepartment(editingDepartment)}
                >
                  <Text style={tw`text-white text-center font-semibold`}>Update Department</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={tw`m-6`}>
              <Text style={tw`text-lg font-semibold mb-4`}>Add Department</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newDepartment.department_name}
                onChangeText={(text) => setNewDepartment({ ...newDepartment, department_name: text })}
                placeholder="New Department Name"
              />
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={newDepartment.department_description}
                onChangeText={(text) => setNewDepartment({ ...newDepartment, department_description: text })}
                placeholder="New Department Description"
              />
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={handleAddDepartment}>
                <Text style={tw`text-white text-center font-semibold`}>Add Department</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Modal_delete
          visible={modalDVisible}
          onDelete={deleteType === 'user' ? handleDeleteUser : handleDeleteDepartment}
          onClose={() => setModalDVisible(false)}
          message={`Are you sure you want to delete this ${deleteType}?`}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}

