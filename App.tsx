import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface UserData {
  id: string;
  name: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
}

interface Namit {
  name: string;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const enableAnonymousAuth = async () => {
      try {
        const userCredential = await auth().signInAnonymously();
        console.log('Anonymous user signed in:', userCredential.user.uid);
      } catch (error: any) {
        console.error('Error with anonymous authentication:', error);
        Alert.alert('Authentication Error', error.message);
      }
    };

    enableAnonymousAuth();
  }, []);

  const uploadName = async () => {
    if (name.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a valid name');
      return;
    }

    try {
      await firestore().collection('users').add({
        name,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Name uploaded successfully!');
      setName(''); // Clear the input
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload name: ' + error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setData([{id: 'loading', name: 'Loading...'}]);
    try {
      const snapshot = await firestore().collection('users').get();
      const fetchedData: UserData[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setData(fetchedData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<UserData> = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.name}>Name: {item.name}</Text>
      <Text style={styles.timestamp}>
        Created At: {item.createdAt?.toDate().toString() || 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Name to Firestore</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        onPress={uploadName}
        style={styles.uploadButton}>
        <Text>Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={fetchData}
        style={[styles.uploadButton, { backgroundColor: 'green' }]}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator></ActivityIndicator>}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No data found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  name: {
    fontSize: 18,
  },
  timestamp: {
    fontSize: 14,
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  uploadButton : {
    // flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: 'cyan',
    borderRadius: 5,
    marginBottom: 20,
  },

});

export default App;
