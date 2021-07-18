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
  Dimensions,
  Animated,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ListItem, Icon } from 'react-native-elements';
import db from '../Config';
import firebase from 'firebase';

export default class SwipableFlatlist extends React.Component {
  constructor(props) {
    super(props);
    console.log('component called ' + this.props.allNotifications);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
    console.log('component end ');
  }

  updateStatusAsRead = (Notifications) => {
    db.collection('Notifications')
      .doc(Notifications.doc_id)
      .update({ Status: 'Read' });
  };

  onSwipeValueChange = (SwipeData) => {
    var notifications = this.state.allNotifications;
    const { key, value } = SwipeData;

    if (value < -Dimensions.get('window').width) {
      const newData = [...notifications];
      this.updateStatusAsRead(notifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };

  renderItem = (data) => (
    <Animated.View>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{data.item.ItemName.toString()}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Animated.View>
  );

  renderHiddenItem = () => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff000',
        paddingLeft: 15,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: 100,
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: '#fff000',
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: 20,
            fontSize: 20,
            alignSelf: 'flex-start',
          }}>
          Mark As Read
        </Text>
      </View>
    </View>
  );

  render() {
    return (
      <View>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get('window').width}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}></SwipeListView>
      </View>
    );
  }
}
