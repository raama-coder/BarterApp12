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

export default class MyBarters extends React.Component {
  constructor() {
    super();
    this.state = {
      donorID: firebase.auth().currentUser.email,
      allBarters: [],
    };
    this.requestRef = null;
  }

  getAllBarters = () => {
    this.requestRef = db
      .collection('AllBarters')
      .where('donorID', '==', this.state.donorID)
      .onSnapshot((snapshot) => {
        var list = [];
        snapshot.docs.map((doc) => {
          var donation = doc.data();
          donation['doc_id'] = doc.id;
          list.push(donation);
        });
        this.setState({ allBarters: list });
      });
  };

    getDonorDetails = (userId) => {
    db.collection('Users')
      .where('Email', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().FirstName + ' ' + doc.data().LastName,
          });
        });
      });
  };

  sendNotification = (itemDetail, requestStatus) => {
    var requestId = itemDetail.RequestId;
    var donorId = itemDetail.DonorId;
    db.collection('Notifications')
      .where('RequestId', '==', requestId)
      .where('DonorId', '==', donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = '';
          if (requestStatus === 'item sent') {
            message = this.state.donorName + ' has sent item';
            alert(message)
          } else {
            message =
              this.state.donorName + ' has shown interest in donating item';
              alert(message)
          }
          db.collection('Notifications').doc(doc.id).update({
            Message: message,
            Status: 'Unread',
            Date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  sendItem = (details) => {
    if (details.requestStatus === 'item sent') {
      var requestStatus = 'donor interested';
      db.collection('AllBarters')
        .doc(details.doc_id)
        .update({ requestStatus: 'donor interested' });
      this.sendNotification(details, requestStatus);
    } else {
      var requestStatus = 'item sent';
      db.collection('AllBarters')
        .doc(details.doc_id)
        .update({ requestStatus: 'item sent' });
      this.sendNotification(details, requestStatus);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.itemName.toString()}</ListItem.Title> 
      </ListItem.Content>
      <TouchableOpacity
        onPress={() => {
          this.sendItem(item);
        }}>
        <Text>Send Item</Text>
      </TouchableOpacity>
    </ListItem>
  );

  componentDidMount() {
    this.getAllBarters();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.state.allBarters.length === 0 ? (
            <View>
              <Text style={styles.text}>List Of All Requested Requests</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allBarters}
              renderItem={this.renderItem}></FlatList>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
