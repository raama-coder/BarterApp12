import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { ListItem, Button, Icon } from 'react-native-elements';
import db from '../Config';
import firebase from 'firebase';

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam('details')['item_Name'],
      reason: this.props.navigation.getParam('details')['reason'],
      requestId: this.props.navigation.getParam('details')['request_Id'],
      userId: firebase.auth().currentUser.email,
      UserId: this.props.navigation.getParam('details')['user_Id'],
      Name: '',
      Contact: '',
      Address: '',
      RequestDocId: '',
    };
  }

  componentDidMount() {
    this.getReceiverDetails();
  }

  getReceiverDetails() {
    db.collection('Users')
      .where('Email', '==', this.state.UserId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            Name: doc.data().FirstName,
            Contact: doc.data().PhoneNo,
            Address: doc.data().Address,
          });
        });
      });

    db.collection('ExchangeRequest')
      .where('request_Id', '==', this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            RequestDocId: doc.id,
          });
        });
      });
  }

  addBartersToDB = () => {
    db.collection('AllBarters').add({
      itemName: this.state.item,
      requestID: this.state.requestId,
      userID: this.state.userId,
      donorID: this.state.UserId,
      requestStatus: 'donor interested',
    });
  };

  addNotification = () => {
    var message = this.state.Name + ' has shown interest in donating the Item';
    db.collection('Notifications').add({
      UserId: this.state.UserId,
      DonorId: this.state.userId,
      RequestId: this.state.requestId,
      ItemName: this.state.item,
      Date: firebase.firestore.FieldValue.serverTimestamp(),
      Status: 'Unread',
      Message: message,
    });
  };

  getUserDetails = (userId) => {
    db.collection('Users')
      .where('Email', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().FirstName + ' ' + doc.data().LastName,
          });
        });
      });
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View>
          <Text style={styles.text}>Name: {this.state.item}</Text>
        </View>
        <View>
          <Text style={styles.text}>Reason: {this.state.reason}</Text>
        </View>
        <View>
          <Text style={styles.text}>Unique Id: {this.state.requestId}</Text>
        </View>
        <View>
          <Text style={styles.text}>Contact: {this.state.Contact}</Text>
        </View>
        <View>
          <Text style={styles.text}>Address: {this.state.Address}</Text>
        </View>
        <View>
          {this.state.userId != this.state.UserId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addBartersToDB();
                this.addNotification();
                this.props.navigation.navigate('Barters');
              }}>
              <Text>Barter</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#99C1CB',
    height: 30,
    width: 80,
    paddingLeft: 20,
    paddingTop: 6,
    borderRadius: 20,
  },
});
