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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {calenderImage, deleteImage} from './assets';
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [wantToDeleteItem, setWantToDeleteItem] = useState<ListItem | null>(
    null,
  );
  const [errorForQuantity, setErrorForQuantity] = useState(false);
  const [dynamicMarginBottom, setdynamicMarginBottom] = useState(0);
  const [loadingForPage, setLoadingForPage] = useState(true);
  const [loadingForList, setLoadingForList] = useState(true)
  const {
    buttonColor,
    fromScreen,
    rates,
    listBackgroundColor,
    quantityContainerBackgroundColor,
  } = route.params;

  useEffect(() => {
    getDataFromStorage();
    setLoadingForPage(true);
  }, []);

  useEffect(() => {
    saveDataToStorage();
    setLoadingForList(true)
    // const sortedData = [...list].sort(
    //   (a, b) =>
    //     new Date(b.date.split('-').reverse().join('-')).getTime() -
    //     new Date(a.date.split('-').reverse().join('-')).getTime()
    // );

    // setList(sortedData);

    // console.log("list : ", JSON.stringify(list))

    // let date = new Date()
    // console.log("date : ", date.toISOString());
  }, [list]);

  const getDataFromStorage = async () => {
    try {
      const data = await AsyncStorage.getItem(fromScreen);
      if (data) {
        setList(JSON.parse(data));
        setLoadingForPage(false);
        setLoadingForList(false)
      }
    } catch (error) {
      console.error('Error reading data from storage:', error);
      setLoadingForPage(false);
      setLoadingForList(false)
    }
  };
  const saveDataToStorage = async () => {
    try {
      await AsyncStorage.setItem(fromScreen, JSON.stringify(list));
      setLoadingForPage(false);
      setLoadingForList(false)
    } catch (error) {
      console.error('Error saving data to storage:', error);
      setLoadingForPage(false);
      setLoadingForList(false)
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
    if (!quantity) {
      setErrorForQuantity(true);
      return;
    }
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
      <Modal visible={isCalenderVisible} transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => setIsCalenderVisible(false)}
          style={{borderWidth: 2, borderColor: 'red'}}>
          <View style={styles.calendarViewedit}>
            {/* <DatePicker
              modal
              mode="date"
              open={isCalenderVisible}
              date={new Date()}
              onConfirm={date => {
                setCalenderDate(date);
              }}
              onCancel={() => {
                setIsCalenderVisible(false);
              }}
            /> */}
            <Calendar
              testID="calendarTestIdsz"
              onDayPress={(date: any) => setCalenderDate(date)}
              style={{borderRadius: 10, width: '90%', alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    if (date.dateString) {
      calenderDate = `${date.day}-${date.month}-${date.year}`;
    } else {
      calenderDate = moment(date).format('DD-MM-YYYY');
    }
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

  const handleRemoveItem = (itemToRemove: ListItem | null) => {
    if (!itemToRemove) return;

    setList(prevList => {
      const updatedList = prevList.filter(item => item.id !== itemToRemove.id);
      return updatedList;
    });
    saveDataToStorage(); // Save the updated list immediately

    setIsDeleteModalVisible(false);
    setWantToDeleteItem(null);
  };

  const confirmDeleteModal = () => {
    return (
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setIsDeleteModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Are you sure you want to delete this item?</Text>
              <View>
                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setIsDeleteModalVisible(false);
                      setWantToDeleteItem(null);
                    }}
                  />
                  <Button
                    title="Delete"
                    onPress={() => {
                      handleRemoveItem(wantToDeleteItem);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const addEntryModal = () => {
    return (
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Quantity : </Text>
              {errorForQuantity && (
                <Text style={styles.errorText}>* Quantity is required</Text>
              )}
              <TextInput
                placeholder="Enter Quantity"
                placeholderTextColor={'black'}
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={value => {
                  setQuantity(value);
                  setErrorForQuantity(false);
                }}
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
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const getSumOfAllAmounts = () => {
    return list.reduce((acc, item) => acc + item.totalAmount, 0);
  };

  const renderListItem = (item: any) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            setIsDeleteModalVisible(true);
            setWantToDeleteItem(item);
          }}
          style={{position: 'absolute', right: 0, top: 8, zIndex: 1}}>
          <Image source={deleteImage} style={{height: 30, width: 30}} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.listItem,
            {
              flex: 1,
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              backgroundColor: listBackgroundColor,
              // borderColor: 'green',
              // borderWidth: 1,
            },
          ]}
          onPress={() => handleEditItem(item)}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.heading, {marginVertical: 2, fontSize: 15}]}>
                Date: {item.date}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: quantityContainerBackgroundColor,
                borderRadius: 20,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              {/* <View
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.heading}>Date: </Text>
                <Text style={[styles.textUnderHeading, {fontSize: 14}]}>
                  {item.date}
                </Text>
              </View>
            </View> */}
              <View
                style={{
                  // borderColor: 'red',
                  // borderWidth: 1,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    // borderColor: 'red', borderWidth: 1,
                    flex: 1,
                  }}>
                  <Text style={styles.heading}>Total Amount:</Text>
                </View>
                <View
                  style={{
                    // borderColor: 'red',
                    // borderWidth: 1,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.styleForQuantity}>
                    ₹{item.totalAmount}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  // borderColor: 'red',
                  // borderWidth: 1,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    // borderColor: 'red', borderWidth: 1,
                    flex: 1,
                  }}>
                  <Text style={styles.heading}>Quantity:</Text>
                </View>
                <View
                  style={{
                    // borderColor: 'red',
                    // borderWidth: 1,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.styleForQuantity}>{item.quantity}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>

      <Header title={fromScreen} />
      { 
        loadingForPage ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{textAlign:'center'}}>Loading...</Text>
          </View>
        ) : (
          <>
            <View
        style={{
          flexDirection: 'row',
          height: 120,
          padding: 10,
          backgroundColor: '#f8f8f8',
        }}>
        <View
          style={{
            borderWidth: 2,
            borderColor: 'rgb(255, 191, 28)',
            flex: 1,
            flexDirection: 'column',
            borderRadius: 20,
            marginRight: 5,
            backgroundColor: 'rgb(253, 238, 169)',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderColor: 'red',
              // borderWidth: 1,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text style={{fontWeight: '700'}}>Current Month</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // borderColor: 'orange',
              // borderWidth: 1,
              borderRadius: 20,
              backgroundColor: 'rgb(255, 191, 28)',
            }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                // borderColor: 'purple',
                // borderWidth: 1,
                flex: 1,
                textAlignVertical: 'center',
              }}>
              ₹{getSumOfAllAmounts()}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: 'rgb(255, 191, 28)',
            flex: 1,
            flexDirection: 'column',
            borderRadius: 22,
            marginLeft: 5,
            backgroundColor: 'rgb(253, 238, 169)',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // borderColor: 'red',
              // borderWidth: 1,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text style={{fontWeight: '700'}}>Past Month</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // borderColor: 'orange',
              // borderWidth: 1,
              borderRadius: 20,
              backgroundColor: 'rgb(255, 191, 28)',
            }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                // borderColor: 'purple',
                // borderWidth: 1,
                flex: 1,
                textAlignVertical: 'center',
              }}>
              ₹{'0'}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          padding: 10,
          backgroundColor: '#f8f8f8',
        }}>
        <Text style={[styles.heading, {fontSize: 20}]}>{fromScreen} List</Text>
        <View
          style={{borderWidth: 1, borderColor: '#686868', marginBottom: -4}}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={list}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => renderListItem(item)}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: dynamicMarginBottom}}
          ListEmptyComponent={
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {loadingForList ? (
                <>
                  <ActivityIndicator size="large" color="#00cc88" />
                  <Text>Loading...</Text>
                </>
              ) : (
                <Text style={[styles.emptyText]}>No items yet.</Text>
              )}
            </View>
          }
          onStartReached={() => {
            setdynamicMarginBottom(0);
          }}
          // onStartReachedThreshold={0.1}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            setdynamicMarginBottom(45);
          }}
        />

        {/* <View
          style={{
            height: 45,
            borderColor: 'red',
            borderWidth: 1,
            backgroundColor: 'rgba(0, 0, 0,0.0)',
            bottom: 0,
            width: '105%',
            zIndex: -1,
          }}></View> */}

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: buttonColor}]}
          onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Modal */}

        {/* <View
          style={{
            // borderColor: 'red',
            // borderWidth: 1,
            height: 90,
            // filter: 'blur(20px)',
            position: 'absolute',
            bottom: 0,
            width: '105%',
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255,0.6)', // Fallback color for semi-transparency
            filter: 'blur(20px)', // Native blur effect
            overflow: 'visible', // Ensures the blur respects the border radius
          }} /> */}
      </View>
      {addEntryModal()}
      {calendarModals()}
      {confirmDeleteModal()}
      </>
        )
      }
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
    paddingHorizontal: 10,
    // borderColor:'red',
    // borderWidth: 2,
    paddingBottom: 45,
    // overflow: 'visible',
  },
  listItem: {
    backgroundColor: '#fff',
    paddingTop: 3,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 20,
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default List;
