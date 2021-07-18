import * as React from 'react';
import { View } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import db from '../Config';
import firebase from 'firebase';

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  getUnReadNotifications = () => {
    db.collection('Notifications')
      .where('Status', '==', 'Unread')
      .onSnapshot((snapshot) => {
        var count = snapshot.docs.map((doc) => doc.data());
        this.setState({ value: count.length });
      });
  };

  componentDidMount() {
    this.getUnReadNotifications();
  }

  BellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="black"
          onPress={() => this.props.navigation.navigate('Notifications')}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
        />
      </View>
    );
  };
  render() {
    return (
      <Header
        backgroundColor="white"
        centerComponent={{
          text: this.props.title,
          style: { color: '#1352aa', fontSize: 25, fontWeight: 'bold' },
        }}
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="black"
            onPress={() => this.props.navigation.toggleDrawer()}
          />
        }
        rightComponent=
         {<this.BellIconWithBadge {...this.props}/>}
        ></Header>
    );
  }
}
