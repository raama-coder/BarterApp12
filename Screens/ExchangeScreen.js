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
} from 'react-native';
import db from '../Config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class Request extends React.Component {
  constructor() {
    super();
    this.state = {
      reason: '',
      itemName: '',
      userId: firebase.auth().currentUser.email,
      IsItemRequestActive: '',
      requestedItemName: '',
      Status: '',
      requestID: '',
      userDocID: '',
      docID: '',
    };
  }

  addRequest = async (itemName, reason) => {
    var userId = this.state.userId;
    var requestId = this.createUniqueId();

    db.collection('ExchangeRequest').add({
      user_Id: userId,
      request_Id: requestId,
      item_Name: itemName,
      reason: reason,
      status: 'Requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await this.getRequest();
    db.collection('Users')
      .where('Email', '==', userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('Users').doc(doc.id).update({
            IsItemRequestActive: true,
          });
        });
      });
    this.setState({ itemName: '', reason: '', requestID: requestId });
    Alert.alert('Item Has Been Requested Successfully');
  };

  createUniqueId = () => {
    return Math.random().toString(36).substring(7);
  };

  getRequest = () => {
    var ItemRequest = db
      .collection('ExchangeRequest')
      .where('user_Id', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().status != 'Received') {
            this.setState({
              Status: doc.data().status,
              requestID: doc.data().request_Id,
              docID: doc.id,
              requestedItemName: doc.data().item_Name,
            });
          }
        });
      });
  };

  getRequestStatus = () => {
    db.collection('Users')
      .where('Email', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            IsItemRequestActive: doc.data().IsItemRequestActive,
            userDocID: doc.id,
          });
        });
      });
  };

  sendNotificationToDonor = () => {
    db.collection('Users')
      .where('Email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().FirstName;
          var lastName = doc.data.LastName;
          db.collection('Notifications')
            .where('RequestId', '==', this.state.requestID)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donorId;
                var itemName = doc.data().itemName;

                db.collection('Notifications').add({
                  Status: 'Unread',
                  Message: name + ' ' + lastName + ' has received ' + itemName,
                  BookName: itemName,
                  DonorId: donorId,
                  Date: firebase.firestore.FieldValue.serverTimestamp(),
                });
              });
            });
        });
      });
  };

  updateItemRequestStatus = () => {
    console.log('in');
    db.collection('ExchangeRequest').doc(this.state.docID).update({
      status: 'Received',
    });
    db.collection('Users')
      .where('Email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('Users')
            .doc(doc.id)
            .update({ IsItemRequestActive: false });
        });
      });
    console.log('out');
  };

  receivedItems = (ItemName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestID;

    db.collection('ReceivedItems').add({
      UserId: userId,
      ItemName: ItemName,
      RequestId: requestId,
      ItemStatus: 'Received',
    });
  };

  componentDidMount() {
    this.getRequest();
    this.getRequestStatus();
  }

  render() {
    if (this.state.IsItemRequestActive) {
      return (
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <MyHeader title="Item Request" navigation={this.props.navigation} />
            <View
              style={{
                margin: 10,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
              }}>
              <Text>Item Name</Text>
              <Text>{this.state.requestedItemName}</Text>
            </View>
            <View
              style={{
                margin: 10,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
              }}>
              <Text>Item Status</Text>
              <Text>{this.state.Status}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.requestBTN}
                onPress={() => {
                  console.log('start');
                  this.sendNotificationToDonor();
                  this.updateItemRequestStatus();
                  this.receivedItems(this.state.requestedItemName);
                  console.log('end');
                }}>
                <Text>I Recevied Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaProvider>
      );
    } else {
      return (
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <MyHeader title="Item Request" />
            <KeyboardAvoidingView>
              <TextInput
                placeholder="Enter Item Id"
                onChangeText={(text) => {
                  this.setState({ itemName: text });
                }}
                style={styles.inputBox}
                value={this.state.itemName}></TextInput>

              <TextInput
                placeholder="Enter Reason to Request Item"
                onChangeText={(text) => {
                  this.setState({ reason: text });
                }}
                style={styles.inputBox}
                value={this.state.reason}></TextInput>
              <View>
                <TouchableOpacity
                  style={styles.requestBTN}
                  onPress={() => {
                    this.addRequest(this.state.itemName, this.state.reason);
                  }}>
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaProvider>
      );
    }
  }
}
const styles = StyleSheet.create({
  inputBox: {
    width: 300,
    height: 50,
    borderWidth: 5,
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '10%',
  },
  requestBTN: {
    backgroundColor: '#e39830',
    height: 50,
    width: 100,
    marginLeft: 100,
    margingTop: 100,
    padding: 20,
  },
});
