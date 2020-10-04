import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, Button, ScrollView, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Constants from "expo-constants";
import {TODOS} from "./data.js";
import { tabBarIcon } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const routeIcons = {
  Complete: "message1",
  All: "md-link",
  Active: "team",

};

const CompleteScreen = () => <Text>Complete Screen</Text>;
const ActiveScreen = () => <Text>Active Screen</Text>
const AllScreen = ({navigation, props}) => {
  const [todoList, setTodoList] = useState(TODOS);
  const [todoBody, setTodoBody] = useState('');

  const onToggleTodo = id => {
    const todo = todoList.find(todo => todo.id === id);
    todo.status = todo.status === 'Done' ? 'Active' : 'Done';

    const foundIndex = todoList.findIndex(todo => todo.id === id);
    todoList[foundIndex] = todo;

    const newTodoList = [...todoList];
    setTodoList(newTodoList);
  };

  const onDeleteTodo = id => {
    const newTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(newTodoList);
  };

  const onSubmitTodo = () => {
    const newTodo = {
      body: todoBody,
      status: 'Active',
      id: todoList.length + 1
    };
    const newTodoList = [...todoList, newTodo];
    setTodoList(newTodoList);
    setTodoBody('');
  };

  const TodoItem = props => {
    const statusStyle = {
      backgroundColor: props.todo.status === 'Done' ? 'blue' : 'green'
    };

    const onLongPress = todo => {
      const prompt = `"${todo.body}"`;
      Alert.alert(
        'Delete your todo?',
        prompt,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => props.onDeleteTodo(todo.id) }
        ],
        { cancelable: true }
      );
    };

    return (
      <TouchableOpacity
        key={props.todo.body}
        style={[styles.todoItem, statusStyle]}
        onPress={() => props.onToggleTodo(props.todo.id)}
        onLongPress={() => onLongPress(props.todo)}
      >
        <Text style={styles.todoText}>
          {props.idx + 1}: {props.todo.body}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      {todoList.map((todo, idx) => {
        return (
          <TodoItem
            idx={idx}
            todo={todo}
            key={todo.body}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}
      <View style={styles.inputContainer}>
        <TextInput
          value={todoBody}
          style={styles.todoInput}
          onChangeText={text => setTodoBody(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmitTodo}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CompleteScreen.navigationOptions = {
  header: null
};



export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName = "AllScreen"
        screenOptions={({ route }) => ({
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "grey",
        }}
      >
        <Tab.Screen name="Complete" component={CompleteScreen} />
        <Tab.Screen name="All" component={AllScreen} />
        <Tab.Screen name="Active" component={ActiveScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  todoItem: {
    margin: 5,
    padding: 10,
    width: '95%',
    minHeight: 20,
    color: 'white',
    borderRadius: 5,
    flexWrap: 'wrap'
  },
  todoText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
    todoInput: {
    width: '95%',
    minHeight: 30,
    color: 'white',
    borderWidth: 1,
    marginTop: '20%',
    marginBottom: '5%',
    borderColor: 'grey'
  },
  inputContainer: {
    flex: 1,
    width: '90%',
    marginTop: 20,
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    height: 50,
    width: '50%',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'blue',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

  //  tabBarIcon: ({ focused }) => (
  //     <tabBarIcon
  //       name={routeIcons[route.name]}
  //       size={24}
  //       color={focused ? "blue" : "grey"}
  //     />
  //   ),