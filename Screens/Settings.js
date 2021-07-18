import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import db from '../Config';
import firebase from 'firebase';

export default class Settings extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      docId: '',
    };
  }

  getData() {
    var User = firebase.auth().currentUser;
    var email = User.email;

    db.collection('Users')
      .where('Email', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.Email,
            firstName: data.FirstName,
            lastName: data.LastName,
            address: data.Address,
            contact: data.PhoneNo,
            docId: doc.id,
          });
        });
      });
  }

  updateData() {
    db.collection('Users').doc(this.state.docId).update({
      FirstName: this.state.firstName,
      LastName: this.state.lastName,
      Address: this.state.address,
      PhoneNo: this.state.contact,
    });
    console.log('Pressed');
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <TextInput
            style={styles.TextInput}
            placeholder={'First Name'}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.TextInput}
            placeholder={'Last Name'}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.TextInput}
            placeholder={'Contact'}
            maxLength={10}
            keyboardType={'numeric'}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}
            value={this.state.contact}
          />
          <TextInput
            style={styles.TextInput}
            placeholder={'Address'}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
          <TextInput
            style={styles.TextInput}
            placeholder={'Email'}
            keyboardType={'email-address'}
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
            value={this.state.emailId}
          />
          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              this.updateData();
            }}>
            <Text> Save </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#ffab91',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  Button: {
    width: '75%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ff5722',
    shadowColor: '#000',
  },
});
