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

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = { requestedRequests: [] };
    this.requestReference = null;
  }

  getRequestList = () => {
    this.requestReference = db
      .collection('ExchangeRequest')
      .onSnapshot((snapshot) => {
        var list = snapshot.docs.map((document) => document.data());
        console.log(list + ' test');
        this.setState({ requestedRequests: list });
      });
  };

  componentDidMount() {
    this.getRequestList();
  }

  componentWillUnmount() {
    this.requestReference = null;
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
                
        <ListItem.Content>
                    
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('UserInfo', { details: item });
            }}>
            <Text style={styles.button}>Exchange</Text>     
          </TouchableOpacity>
                    <ListItem.Title>{item.item_Name.toString()}</ListItem.Title>
                      <ListItem.Subtitle>{item.reason}</ListItem.Subtitle>
                  
        </ListItem.Content>
              
      </ListItem>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Home Screen" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedRequests.length === 0 ? (
            <View style={styles.text}>
              <Text>List Of All Requested Requests</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedRequests}
              renderItem={this.renderItem}></FlatList>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#99C1CB',
    height: 35,
    width: 100,
    paddingLeft: 20,
    paddingTop: 7,
    borderRadius: 20,
  },
});
