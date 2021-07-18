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
import { ListItem } from 'react-native-elements';
import db from '../Config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default class Received extends React.Component {
  constructor() {
    super();
    this.state = {
      receivedItemList: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }
  getReceivedItemsList = () => {
    this.requestRef = db
      .collection('ExchangeRequest')
      .where('user_Id', '==', this.state.userId)
      .where('status', '==', 'Received')
      .onSnapshot((snapshot) => {
        var receivedItemList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          receivedItemList: receivedItemList,
        });
      });
  };

  componentDidMount() {
    this.getReceivedItemsList();
  }

  componentWillUnmount() {
    this.requestReference = null;
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
           <ListItem.Title>{item.item_Name.toString()}</ListItem.Title> {' '}
          <ListItem.Subtitle>{item.reason}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <MyHeader title="Items Received" navigation={this.props.navigation} />
          <View style={{ flex: 1 }}>
            {this.state.receivedItemList.length === 0 ? (
              <View style={styles.text}>
                <Text>No Items Have Been Received</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedItemList}
                renderItem={this.renderItem}></FlatList>
            )}
          </View>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
