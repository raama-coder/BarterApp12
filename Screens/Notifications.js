import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import db from '../Config';
import firebase from 'firebase';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import MyHeader from '../components/MyHeader';

export default class Notifications extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection('Notifications')
      .where('Status', '==', 'Unread')
      .where('UserId', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification['doc_id'] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef = null;
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.ItemName.toString()}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <View>
          <MyHeader title={'Notifications'}></MyHeader>
        </View>
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length === 0 ? (
            <View>
              <Text>List Of All Notifications</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allNotifications}
              renderItem={this.renderItem}></FlatList>
          )}
        </View>
      </SafeAreaProvider>
    );
  }
}
