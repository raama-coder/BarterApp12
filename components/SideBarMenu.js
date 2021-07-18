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
import firebase from 'firebase';

import { Avatar } from 'react-native-elements';
import { DrawerItems } from 'react-navigation-drawer';
import * as ImagePicker from 'expo-image-picker';

export default class SideDrawer extends React.Component {
  state = {
    name: '',
    docId: '',
    image: '',
    userId: firebase.auth().currentUser.email,
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('user_profile/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({ image: uri });
      this.uploadImage(uri, this.state.userId);
    }
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profile/' + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

    componentDidMount() {
    this.fetchImage(this.state.userId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.5, alignItems: 'center' }}>
          <Avatar
            containerStyle={{
              flex: 0.75,
              width: '40%',
              margin: 20,
              height: '20%',
              borderRadius: 30,
            }}
            rounded
            source={{ uri: this.state.image }}
            size="medium"
            onPress={() => {
              this.selectPicture();
            }}
          />
          <Text style={{ fontSize: 25, fontWeight: 'bold', paddingTop: 20 }}>
            Name: {this.state.name}
          </Text>
        </View>
        <View style={styles.drawerContainer}>
          <DrawerItems {...this.props}></DrawerItems>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              this.props.navigation.navigate('Welcome');
              firebase.auth().signOut();
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContainer: {
    flex: 0.8,
    paddingTop: 30,
  },
  logoutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
});
