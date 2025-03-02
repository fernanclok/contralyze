import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import {
  fetchDepartaments,
  fetchCompanyData,
  fetchUsers,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addUser,
  updateUser,
  deleteUser,
} from "@/hooks/ts/manage_profile/Manage_company";
import { useNavigation } from "@react-navigation/native";
import  Modal_delete  from "../../components/Modal_delete";
import MainLayout from "../../components/MainLayout";
import { Picker } from "@react-native-picker/picker";
import { ProtectedRoute } from "../../AuthProvider";
import { useState, useEffect } from "react";
import SlidingModal from "../../components/SlidingModal";
import tw from "twrnc";
import { Switch } from "react-native";


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
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [departmentUpdateModalVisible, setDepartmentUpdateModalVisible] = useState(false);
  const [userUpdateModalVisible, setUserUpdateModalVisible] = useState(false);

  
  
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


  const handleUpdateUser = async (user) => {
    await updateUser(user);
    setUserUpdateModalVisible(false);
    await loadData();
    setEditingUser(null);
  };

  
  const handleAddUser = async () => {
    await addUser(newUser);
    setUserModalVisible(false)
    await loadData();
    setNewUser({ first_name: "",last_name:"", email: "", password: "", department_id:"", role: ""});
  };
  
  const handleDeleteUser = async () => {
    if (itemToDelete) {
      try {
        await deleteUser(itemToDelete);
        setModalDVisible(false);
        await loadData();
        setItemToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddDepartment = async () => {
    await addDepartment(newDepartment);
    setDepartmentModalVisible(false)
    await loadData();
    setNewDepartment({ department_name: "" , department_description: ""});
  };

  const handleUpdateDepartment = async (department) => {
    await updateDepartment(department);
    setEditingDepartment(null);
    await loadData();
    setDepartmentUpdateModalVisible(false);
  };
  
  const handleDeleteDepartment = async () => {
    if (itemToDelete) {
      try {
        await deleteDepartment(itemToDelete);
        setModalDVisible(false);
        await loadData();
        setItemToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onChangeStatus = async (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      const updatedUser = { ...user, status: user.status === "active" ? "inactive" : "active" };
      try {
        await updateUser(updatedUser);
        await loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const confirmDelete = (id, type) => {
    setDeleteType(type);
    setItemToDelete(id);
    setModalDVisible(true);
  };

  useEffect(() => {
    loadData();
  }, []);


  const renderTable = (data, columns, onEdit, onDelete, isUserTable) => (
    <View style={tw`border border-gray-300 rounded-lg overflow-hidden mb-6`}>
      <View style={tw`flex-row bg-gray-300 border-b border-gray-300`}>
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
          <View key={item.id} style={[tw`flex-row border-b border-gray-300 ${item.id % 2 === 0 ? "bg-gray-100" : ""}`,  item.status === "inactive" && { opacity: 0.5 }]}>
            {columns.map((column, index) => (
              <View key={index} style={tw`flex-1 p-3`}>
                {column.key === "status" ? (
                  <Text style={tw`text-${item[column.key] === "active" ? "green" : "red"}-500`}>
                    {item[column.key]}
                  </Text>
                ) : (
                  <Text>{item[column.key]}</Text>
                )}
              </View>
            ))}
            <View style={tw`w-24 p-3 flex justify-around`}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Text style={tw`text-blue-500`}>Edit</Text>
              </TouchableOpacity>
              {isUserTable  ? (
              // Solo para usuarios, cambiamos el botón a "Deactivate"
              <TouchableOpacity onPress={() => onChangeStatus(item.id)}>
                {/* <Text style={tw`text-orange-500`}>
                  {item.status === "active" ? "Deactivate" : "Activate"}
                  </Text> */}
                <Switch
                  trackColor={{ false: "#D1D5DB", true: "#10B981" }} // Gris para inactivo, verde para activo
                  thumbColor={item.status === "active" ? "#fff" : "#9CA3AF"} // Blanco para activo, gris para inactivo
                  ios_backgroundColor="#D1D5DB" // Color de fondo en iOS cuando está inactivo
                  style={tw`mt-1`} // Alineación sutil si es necesario
                  value={item.status === "active"}
                  onValueChange={() => onChangeStatus(item.id)}
                />
              </TouchableOpacity>
            ) : (
              // Solo para departamentos, el botón es "Delete"
              <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={tw`text-red-500`}>Delete</Text>
              </TouchableOpacity>
            )}
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
            <View style={tw`bg-white rounded-lg p-4 mb-6 border border-gray-300 shadow`}>
              <Text style={tw`text-xl font-semibold mb-4`}>Company Details</Text>
              <Text style={tw`p-2 font-thin text-gray-400`}>Company Name</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={company.name}
                onChangeText={(text) => setCompany({ ...company, name: text })}
                placeholder="Company Name"
                readOnly={true}
              />
              <Text style={tw`p-2 font-thin text-gray-400`}>Company Address</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={company.address}
                onChangeText={(text) => setCompany({ ...company, address: text })}
                placeholder="Company Address"
                readOnly={true}
              />
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
                { title: "Status", key: "status"}
              ],
              (user) => {
                setEditingUser(user);
                setUserUpdateModalVisible(true);
              },
              (id) => confirmDelete(id, 'user'), true
            )}
            <View style={tw`m-6`}>
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={() => setUserModalVisible(true)}>
                <Text style={tw`text-white text-center`}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`m-6`}>
            <Text style={tw`text-xl font-semibold mb-2`}>Departments</Text>
            {renderTable(departments, [{ title: "Name", key: "name" }, { title: "Description", key: "description" }], (department) => {
              setEditingDepartment(department);
              setDepartmentUpdateModalVisible(true);
            }, (id) => confirmDelete(id, 'department'),false)}
            <View style={tw`m-6`}>
              <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={() => setDepartmentModalVisible(true)}>
                <Text style={tw`text-white text-center`}>Add Department</Text>
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

        {/* Add user modal */}
        <SlidingModal visible={userModalVisible} onClose={() => setUserModalVisible(false)}>
          <Text style={tw`text-lg font-semibold mb-4`}>Add New User</Text>
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
            <Picker.Item label="Select Department" value="" enabled={false} />
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
            <Picker.Item label="Select Role" value="" enabled={false} />
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
          <TouchableOpacity style={tw`bg-green-500 p-2 rounded-md`} onPress={handleAddUser}>
            <Text style={tw`text-white text-center`}>Add User</Text>
          </TouchableOpacity>
        </SlidingModal>
        
        {/* Update user modal */}
        <SlidingModal visible={userUpdateModalVisible} onClose={() => setUserUpdateModalVisible(false)}>
          <Text style={tw`text-lg font-semibold mb-4`}>Update User</Text>
            <View style={tw`flex flex-row justify-between items-center mb-2`}>
              <Text style={tw`font-bold`}>Status</Text>
              <Switch
                  trackColor={{ false: "#D1D5DB", true: "#10B981" }} // Gris para inactivo, verde para activo
                  thumbColor={editingUser?.status === "active" ? "#fff" : "#9CA3AF"} // Blanco para activo, gris para inactivo
                  ios_backgroundColor="#D1D5DB" // Color de fondo en iOS cuando está inactivo
                  style={tw`mt-1`} // Alineación sutil si es necesario
                  value={editingUser?.status === "active"}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, status: value ? "active" : "inactive" })
                  }
                />
            </View>
            <View>
              <Text>First Name</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                  value={editingUser?.first_name}
                  onChangeText={(text) => setEditingUser({ ...editingUser, first_name: text })}
                  placeholder="User Name"
                />
            </View>
            <View>
              <Text>Last Name</Text>
                <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={editingUser?.last_name}
                onChangeText={(text) => setEditingUser({ ...editingUser, last_name: text })}
                placeholder="User Last Name"
              />
            </View>
            <View>
              <Text>Email</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                value={editingUser?.email}
                onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
                placeholder="User Email"
              />
            </View>
            <View style={tw`flex flex-row justify-center items-center gap-2 mb-2 w-full`}>
                   <View style={tw`w-1/2`}>
                      <Text>Department</Text>
                      <Picker
                        style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                        selectedValue={editingUser?.department_id}
                        onValueChange={(itemValue, itemIndex) =>
                          setEditingUser({ ...editingUser, department_id: itemValue })
                        }
                      >
                        <Picker.Item label="Select Department" value=""/>
                      {departments.map((department) => (
                        <Picker.Item key={department.id} label={department.name} value={department.id} />
                      ))}
                    </Picker>
                   </View>
                   <View style={tw`w-1/2`}>
                    <Text>Role</Text>
                    <Picker
                      style={tw`border border-gray-300 rounded-md p-2 mb-2`}
                      selectedValue={editingUser?.role}
                      onValueChange={(itemValue, itemIndex) =>
                        setEditingUser({ ...editingUser, role: itemValue })
                      }
                    >
                      <Picker.Item label="Select Role" value=""/>
                      <Picker.Item label="User" value="user" />
                      <Picker.Item label="Admin" value="admin" />
                    </Picker>
                  </View>
            </View>
            
          <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-md`} onPress={() => handleUpdateUser(editingUser)}>
            <Text style={tw`text-white text-center`}>Update User</Text>
          </TouchableOpacity>
        </SlidingModal>

        {/* Add department modal */}
        <SlidingModal visible={departmentModalVisible} onClose={() => setDepartmentModalVisible(false)}>
          <Text style={tw`text-lg font-semibold mb-4`}>Add New Department</Text>
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
            <Text style={tw`text-white text-center`}>Add Department</Text>
          </TouchableOpacity>
        </SlidingModal>

        {/* Update department modal */}
        <SlidingModal visible={departmentUpdateModalVisible} onClose={() => setDepartmentUpdateModalVisible(false)}>
          <Text style={tw`text-lg font-semibold mb-4`}>Update Department</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-md p-2 mb-2`}
            value={editingDepartment?.name}
            onChangeText={(text) => setEditingDepartment({ ...editingDepartment, name: text })}
            placeholder="Department Name"
          />
          <TextInput
            style={tw`border border-gray-300 rounded-md p-2 mb-2`}
            value={editingDepartment?.description}
            onChangeText={(text) => setEditingDepartment({ ...editingDepartment, description: text })}
            placeholder="Department Description"
          />
          <TouchableOpacity style={tw`bg-blue-500 p-2 rounded-md`} onPress={() => handleUpdateDepartment(editingDepartment)}>
            <Text style={tw`text-white text-center`}>Update Department</Text>
          </TouchableOpacity>
        </SlidingModal>

      </MainLayout>
    </ProtectedRoute>
  );
}

