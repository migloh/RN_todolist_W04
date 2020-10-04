import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, Button, ScrollView, TextInput,ImageBackground, KeyboardAvoidingView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import {TODOS} from "./data.js";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const allThings = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Todo" component={AllScreen}  options={{ title: 'All todo' }} />
        <Stack.Screen name="Details" component={SingleTodoScreen} options={{ title: 'Content' }} />
      </Stack.Navigator>
  );
}
const allComplete = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Completed" component={CompleteScreen}  options={{ title: 'Completed' }} />
        <Stack.Screen name="Details" component={SingleTodoScreen} />
      </Stack.Navigator>
  );
}

const allActive = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Active" component={ActiveScreen}  options={{ title: 'Active' }} />
        <Stack.Screen name="Details" component={SingleTodoScreen} />
      </Stack.Navigator>
  );
}
const CompleteScreen = () => <Text>Complete Screen</Text>
const ActiveScreen = () => <Text>Active Screen</Text>

const AllScreen = ({navigation}) => {
  const [todoList, setTodoList] = useState(TODOS);
  const [todoBody, setTodoBody] = useState('');

  const onToggleTodo = id => {
    const todo = todoList.find(todo => todo.id === id);
    todo.status = todo.status === 'Done' ? 'Active' : 'Done';

    const foundIndex = todoList.findIndex(todo => todo.id === id);
    todoList[foundIndex] = todo;

    const newTodoList = [...todoList];
    setTodoList(newTodoList);

    setTimeout(() => {
      navigation.navigate('SingleTodoList', {
        updatedTodo: todo
      });
    }, 1000);

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
    <ImageBackground style={styles.container} source={{ uri: 'https://gray-kcrg-prod.cdn.arcpublishing.com/resizer/0_CVXjDCy2bCyYm55rhn4rhXT0A=/1200x675/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/SV24O2UNBJKAFCJDNEEZ27VC6U.jpg' }}>
  <KeyboardAvoidingView
    enabled
    behavior="padding"
    
  >
    
    <View style={styles.container}>
      <ScrollView>
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
      </ScrollView>
      </View>
    
  </KeyboardAvoidingView>
  </ImageBackground>
  );
};

const SingleTodoScreen = ({route}) => {
  return (
    <View style={styles.containerDetails}>
      <Text style={styles.headerText}>
        {route.params?.id}. {route.params?.status}
      </Text>
      <Text style={styles.bodyText}>{route.params?.body}</Text>
    </View>
  );
};

const routeIcons = {
  Complete: "checkcircle",
  All: "bars",
  Active: "downcircleo",

};

export default function App() {
  return (
    <NavigationContainer initialRouteName="All">
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
          <AntDesign
            name={routeIcons[route.name]}
            size={24}
            color={focused ? "blue" : "grey"}
          />
        ), 
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "grey",
        }}
      >
        <Tab.Screen name="Complete" component={allComplete} />
        <Tab.Screen name="All" component={allThings} />
        <Tab.Screen name="Active" component={allActive} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

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
  },

  containerDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerContainer: {
    flexDirection: 'row'
  },
  headerText: {
    fontSize: 30
  },
  bodyText: {
    fontSize: 50
  },

});

  //  tabBarIcon: ({ focused }) => (
  //     <tabBarIcon
  //       name={routeIcons[route.name]}
  //       size={24}
  //       color={focused ? "blue" : "grey"}
  //     />
  //   ), 