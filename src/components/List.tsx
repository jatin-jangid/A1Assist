import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {calenderImage} from './assets';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import Header from './Header';
interface ListItem {
  id: number;
  quantity: number;
  date: string;
  totalAmount: number;
}

const List = ({props, navigation, route}: any) => {
  const [list, setList] = useState<ListItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);

  const {buttonColor, fromScreen, rates} = route.params;

  useEffect(() => {
    // console.log(props.buttonColor)
    getDataFromStorage();
  }, []);

  useEffect(() => {
    saveDataToStorage();
  }, [list]);

  const getDataFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem(fromScreen);
      if (data) {
        setList(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error reading data from storage:', error);
    }
  };
  const saveDataToStorage = async () => {
    try {
      await AsyncStorage.setItem(fromScreen, JSON.stringify(list));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const handleAddItem = () => {
    setModalVisible(true);
    const nowDate = new Date().toISOString();
    const momentDate = moment(nowDate).format('DD-MM-YYYY');
    setSelectedItem(null);
    setQuantity('');
    setDate(momentDate);
  };

  const handleSaveItem = async () => {
    const newItem: ListItem = {
      id: selectedItem ? selectedItem.id : Date.now(),
      quantity: parseInt(quantity, 10),
      date,
      totalAmount: parseInt(quantity, 10) * rates,
    };

    if (selectedItem) {
      // Update item
      setList(prevList =>
        prevList.map(item =>
          item.id === selectedItem.id ? {...item, ...newItem} : item,
        ),
      );
    } else {
      // Add new item
      setList(prevList => [...prevList, newItem]);
    }

    setModalVisible(false);
  };

  const handleEditItem = async (item: ListItem) => {
    setSelectedItem(item);
    setQuantity(item.quantity.toString());
    setDate(item.date);
    setModalVisible(true);
  };

  const calendarModals = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setIsCalenderVisible(false)}>
        <Modal visible={isCalenderVisible} transparent={true}>
          <View style={styles.calendarViewedit}>
            <DatePicker
              modal
              mode="date"
              open={isCalenderVisible}
              date={new Date()}
              onConfirm={date => {
                console.log(date);
                setCalenderDate(date);
              }}
              onCancel={() => {
                setIsCalenderVisible(false);
              }}
            />
            {/* <Calendar
              testID="calendarTestIdsz"
              onDayPress={(date: any) => setCalenderDate(date)}
              style={{borderRadius: 10, width: '90%', alignSelf: 'center'}}
            /> */}
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  };

  const setCalenderDate = (
    date:
      | {
          dateString: string;
          day: string;
          month: string;
          year: string;
          timestamp: string;
        }
      | any,
  ) => {
    // const calenderDate = moment(date.dateString).format('dd-mm-yyyy');
    let calenderDate = '';
    console.log('date.dateString: ' + date.dateString);
    if (date.dateString) {
      calenderDate = `${date.day}-${date.month}-${date.year}`;
    } else {
      calenderDate = moment(date).format('DD-MM-YYYY');
    }
    console.log(calenderDate);
    setDate(calenderDate);
    setIsCalenderVisible(false);
    // this.setState({showDates:date.dateString})
    // const [year, month] = date.dateString.split('-');
    // const formattedDate = `${year}-${month}-01`;
    // this.setState({
    //   selecteDates: formattedDate,
    //   calendarModals: false
    // });
  };

  return (
    <>
      <Header title={fromScreen} />
      <View style={styles.container}>
        <FlatList
          data={list}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                {
                  flex: 1,
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  borderColor: 'green',
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleEditItem(item)}>
              <View
                style={{
                  borderColor: 'red',
                  borderWidth: 1,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <View style={{}}>
                  <Text style={styles.heading}>Total Amount:</Text>
                  <Text style={styles.textUnderHeading}>
                    ₹{item.totalAmount}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.heading}>Date: </Text>
                  <Text style={[styles.textUnderHeading,{ fontSize: 14 }]}>{item.date}</Text>
                </View>
              </View>
              <View
                style={{
                  borderColor: 'red',
                  borderWidth: 1,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{borderColor: 'red', borderWidth: 1, flex: 1}}>
                  <Text style={styles.heading}>Quantity:</Text>
                </View>
                <View style={{borderColor: 'red', borderWidth: 1, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.styleForQuantity}>{item.quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText]}>No items yet.</Text>
          }
        />

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: buttonColor}]}
          onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Quantity : </Text>
              <TextInput
                placeholder="Enter Quantity"
                placeholderTextColor={'black'}
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <Text>Select Date : </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  placeholder="Enter Date"
                  placeholderTextColor={'black'}
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  editable={false}
                />
                <TouchableOpacity onPress={() => setIsCalenderVisible(true)}>
                  <Image
                    source={calenderImage}
                    style={{height: 25, width: 25, left: -40, zIndex: 1}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Save" onPress={handleSaveItem} />
              </View>
            </View>
          </View>
        </Modal>
        {calendarModals()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#00cc88',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  calendarViewedit: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  textUnderHeading: {
    fontWeight: '600',
    fontSize: 20,
  },
  styleForQuantity: {
    fontWeight: 'bold',
    fontSize: 40,
  }
});

export default List;
