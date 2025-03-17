
import {  ImageSourcePropType } from 'react-native';
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ImageBackground, Modal, FlatList, Dimensions } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import AntDesign from "@expo/vector-icons/AntDesign"
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/ru';

LocaleConfig.locales['ru'] = {
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    monthNamesShort: [
        'Янв.',
        'Фев.',
        'Мар.',
        'Апр.',
        'Май.',
        'Июн.',
        'Июл.',
        'Авг.',
        'Сен.',
        'Окт.',
        'Ноя.',
        'Дек.',
    ],
    dayNames: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
    ],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

const { width } = Dimensions.get('window');

const images = [
    require("../assets/images/my.png"),
    require("../assets/images/my.png"),  
    require("../assets/images/my.png"), 
    require("../assets/images/my.png"),
    require("../assets/images/my.png"),  
    require("../assets/images/my.png"),  
];


export default function App() {
    const [rating, setRating] = useState(4.6);
    const [isFavorite, setIsFavorite] = useState(false);
    const [dailyRate] = useState(1578);
    const [modalVisible, setModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [count1, setCount1] = useState(1);
    const [count2, setCount2] = useState(1);
    const [count3, setCount3] = useState(1);
    const [guestCount, setGuestCount] = useState(0);
    const [selectedDatesVisible, setSelectedDatesVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [datesSelected, setDatesSelected] = useState(false);  

    const onDayPress = (day: { dateString: string }) => {
        if (!startDate) {
            setStartDate(day.dateString);
            setEndDate('');
        } else if (!endDate && day.dateString > startDate) {
            setEndDate(day.dateString);
        } else {
            setStartDate(day.dateString);
            setEndDate('');
        }
    };

    const markedDates = useMemo(() => {
        const dates: { [key: string]: { selected: boolean; marked?: boolean; selectedColor?: string; color?: string } } = {};

        if (startDate) {
            dates[startDate] = { selected: true, marked: true, selectedColor: '#2980b9' };
        }
        if (endDate) {
            dates[endDate] = { selected: true, marked: true, selectedColor: '#2980b9' };
        }
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            let currentDate = start;

            while (currentDate <= end) {
                dates[currentDate.toISOString().split('T')[0]] = {
                    selected: true,
                    color: '#FF852D',
                };
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        return dates;
    }, [startDate, endDate]);


    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const openModal = useCallback(() => {
        setModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVisible(false);
    }, []);

    const handleConfirm = () => {
        const totalGuests = count1 + count2 + count3;
        setGuestCount(totalGuests);
        closeModal();
    };

    const openDateModal = useCallback(() => {
        setDateModalVisible(true);
    }, []);

    const closeDateModal = useCallback(() => {
        setDateModalVisible(false);
        setSelectedDatesVisible(true);
        setDatesSelected(true); 
    }, []);

    const onChangeDatesPress = () => {
        setSelectedDatesVisible(false);
        openDateModal();
        setDatesSelected(false); 
    };


    const displayStartDate = startDate ? moment(startDate).locale('ru').format('D MMMM') : 'Дата не выбрана';
    const displayEndDate = endDate ? moment(endDate).locale('ru').format('D MMMM') : 'Дата не выбрана';
    const numberOfNights = startDate && endDate ? moment(endDate).diff(moment(startDate), 'days') : 0;

    const renderImageItem = ({ item }: { item: ImageSourcePropType }) => (
        <Image source={item} style={styles.carouselImage} />
    );
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => console.log("Back")}>
                        <Icon name="chevron-left" size={24} color='rgb(230, 153, 51)' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.internetButton} onPress={() => console.log("Internet")}>
                        <FontAwesome5 name="wifi" size={20} color="#f5f5f5" />
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    <FlatList
                        data={images}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={({ viewableItems }) => {
                            if (viewableItems.length > 0) {
                                if (viewableItems[0] && viewableItems[0].index !== null && viewableItems[0].index !== undefined) {
                                    setCurrentImageIndex(viewableItems[0].index);
                                } else {
                                    console.warn("viewableItems[0] или viewableItems[0].index равны null или undefined");
                                    setCurrentImageIndex(0);
                                }
                            }
                        }}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50,
                        }}
                    />
                    <View style={styles.priceTag}>
                        <Text style={styles.priceTagText}>{dailyRate} ₽ / сутки</Text>
                    </View>

                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentImageIndex ? styles.activeDot : null,
                                ]}
                            />
                        ))}
                    </View>

                </View>
            <View style={styles.containerAboveDetails}>
                <View style={styles.details}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Студия</Text>
                        <TouchableOpacity onPress={toggleFavorite}>
                            <View style={styles.ratingContainer}>
                                <Icon
                                    name="star"
                                    size={16}
                                    color={isFavorite ? "#f9f9f9" : "#ffcc00"}
                                    style={styles.ratingStar}
                                />
                                <Text style={styles.ratingText}>{rating}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.location}>г. Тюмень, Мельникайте, д. 70</Text>

                    <View style={styles.guestSection}>
                        <Text style={styles.guestText}>Укажите количество гостей</Text>
                        <TouchableOpacity style={styles.addGuestButton} onPress={openModal}>
                            <Text style={styles.addGuestText}>
                                {guestCount > 0 ? `${guestCount} гостей` : "+ Добавить"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                
                    {selectedDatesVisible ? (
                        <View style={styles.selectedDatesSection}>
                            <View style={styles.dateRange}>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.dateText}>{displayStartDate}</Text>
                                    <View style={styles.timeBox}>
                                        <Text style={styles.timeTextValue}>00:50</Text>
                                    </View>
                                </View>

                                <Image
                                    source={require("../assets/images/dots.png")}
                                    style={styles.separatorImage}
                                />

                                <View style={styles.dateContainer}>
                                    <Text style={styles.dateText}>{displayEndDate}</Text>
                                    <View style={styles.timeBox}>
                                        <Text style={styles.timeTextValue}>00:50</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.nightsText, { textAlign: 'center' }]}>{numberOfNights} ночей</Text>
                            <Text style={styles.timeText}>Если нужно изменить время заезда/выезда нажмите на время</Text>
                            <TouchableOpacity
                                style={styles.changeDatesButton}
                                onPress={onChangeDatesPress}
                            >
                                <Text style={styles.changeDatesText}>Изменить даты</Text>
                            </TouchableOpacity>

                        </View>
                    
                    ) : (
                        <TouchableOpacity style={styles.priceBlock} onPress={openDateModal}>
                            <View>
                                <Text style={styles.priceText}>
                                    {dailyRate} <Text style={styles.currency}>P</Text><Text style={styles.perNight}>/сутки</Text>
                                </Text>
                                <Text style={styles.chooseDateText}>Выберите даты</Text>
                            </View>
                            <Icon name="chevron-right" size={20}
                                color="#ff6600" />
                        </TouchableOpacity>
                    )}

                    {datesSelected && (  
                        <TouchableOpacity style={styles.priceSection1} onPress={() => console.log("Navigate to booking")}>
                            <Image source={require("../assets/images/price.png")} style={styles.totalPriceImage} />
                        </TouchableOpacity>
                    )}

                    <Image
                        source={require("../assets/images/discount.png")} 
                        style={styles.discountImage}
                    />
                </View>
            </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalView}>
                        <View style={styles.head}>
                            <Text style={styles.modalText}>Количество гостей</Text>
                            <TouchableOpacity style={styles.close} onPress={closeModal}>
                                <AntDesign name="close" size={25} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.touchable}>
                            <Text style={styles.touchableText}>Взрослые</Text>
                            <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count1 > 0) setCount1(count1 - 1); }}>
                                <Text style={styles.squareButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{count1}</Text>
                            <TouchableOpacity style={styles.squareButton} onPress={() => setCount1(count1 + 1)}>
                                <Text style={styles.squareButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.touchable}>
                            <Text style={styles.touchableText}>Питомец</Text>
                            <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count2 > 0) setCount2(count2 - 1); }}>
                                <Text style={styles.squareButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{count2}</Text>
                            <TouchableOpacity style={styles.squareButton} onPress={() => setCount2(count2 + 1)}>
                                <Text style={styles.squareButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.touchable}>
                            <Text style={styles.touchableText}>Дети</Text>
                            <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count3 > 0) setCount3(count3 - 1); }}>
                                <Text style={styles.squareButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{count3}</Text>
                            <TouchableOpacity style={styles.squareButton} onPress={() => setCount3(count3 + 1)}>
                                <Text style={styles.squareButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
                            <Image source={require("../assets/images/confirm.png")}></Image>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dateModalVisible}
                    onRequestClose={closeDateModal}
                >
                    <View style={styles.modalView}>
                        <View style={styles.head}>
                            <Text style={styles.modalText}>Выберите даты</Text>
                            <TouchableOpacity style={styles.close} onPress={closeDateModal}>
                                <AntDesign name="close" size={25} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.calendarContainer}>
                            <CalendarList
                                pastScrollRange={12}
                                futureScrollRange={12}
                                scrollEnabled={true}
                                showScrollIndicator={true}
                                onDayPress={onDayPress}
                                markedDates={markedDates}
                                markingType={'period'}
                            />
                        </View>

                        <TouchableOpacity style={styles.confirm} onPress={closeDateModal}>
                            <Image source={require("../assets/images/confirm.png")}></Image>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        height: 1100,
    },
    imageContainer: {
        position: "relative",
        height: 269,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    priceTag: {
        position: "absolute",
        top: 230,
        left: 15,
        backgroundColor: "rgb(228, 127, 33)",
        paddingVertical: 5,
        paddingHorizontal: 18,
        borderRadius: 5,
        zIndex: 1,
    },
    priceTagText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    details: {
        width: '100%',
        height: '100%',
        paddingTop: 25,
        paddingLeft: 13,
        paddingRight: 10,
        paddingBottom: -100,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        elevation: 3,
    },
    containerAboveDetails: {
        backgroundColor: 'white',
        borderRadius:12,
    },
    titleRow: {
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222",
    },
    location: {
        fontSize: 15,
        color: "#777",
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 14,
    },
    ratingStar: {
        marginRight: 2,
    },
    ratingText: {
        fontSize: 14,
        color: "#555",
    },
    guestSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    guestText: {
        fontSize: 16,
        color: "#333",
    },
    addGuestButton: {
        backgroundColor: "transparent",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addGuestText: {
        color: "rgb(230, 147, 51)",
        fontWeight: "bold",
    },
    priceText: {
        fontSize: 33,
        fontWeight: "bold",
        color: "#222",
    },
    currency: {
        fontSize: 33,
        color: "#222",
    },
    perNight: {
        fontSize: 15,
        color: "#222",
    },
    chooseDateText: {
        color: "#FF6600",
        fontWeight: "bold",
    },
    header: {
        position: "absolute",
        top: -10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        borderRadius: 16,
        paddingTop: 16,
        zIndex: 2,
    },
    backButton: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 7,
        width: 40,
        height: 40
    },
    internetButton: {
        padding: 8,
        backgroundColor: "rgb(230, 138, 51)",
        borderRadius: 11,
    },
    modalView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '80%',
        width: '100%',
        position: 'absolute',
        bottom: 0,

    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold',
    },
    close: {
        marginLeft: 110

    },
    head: {
        flexDirection: 'row'
    },
    calendarContainer: {
        flex: 1,
        width: '100%',
        marginTop: 10,
        marginBottom: 80,
        marginRight: 20,
    },

    selectedDatesSection: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    dateRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nightsText: {
        fontSize: 16,
        color: '#777',
    },
    timeText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    changeDatesButton: {
        backgroundColor: "transparent",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    changeDatesText: {
        color: "rgb(230, 138, 51)",
        fontWeight: "bold",
    },

    touchable: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 2,
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        elevation: 10,
    },
    touchableText: {
        color: 'Black',
        fontSize: 16,
        marginLeft: 20,
        alignSelf: 'flex-start',
    },
    squareButton: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FF852D',
        marginRight: 12,
        alignSelf: 'flex-end',
        marginTop: -25,
    },
    squareButtonText: {
        fontSize: 17,
    },
    counterText: {
        fontSize: 15,
        marginRight: -180,
        marginTop: -25
    },
    squareButtonl: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FF852D',
        marginRight: 67,
        alignSelf: 'flex-end',
        marginTop: -25,
    },
    confirm: {
        width: '50%',
        padding: 15,

        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 100,
    },
    priceBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 26,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    smallImageContainer: {
        position: 'absolute',
        bottom: -70,
        right: 10,
        padding: 0,
    },
    smallImage: {
        width: 180,
        height: 170,
        resizeMode: 'contain',
    },

    separatorImage: {
        width: 200,
        height: 60,
        resizeMode: 'contain',
    },
    dateContainer: {
        alignItems: 'center'
    },
    timeBox: {
        backgroundColor: '#FAF0E6',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 4,
    },
    timeTextValue: {
        fontSize: 14,
        color: '#777'
    },
    priceSection1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 14,
        paddingVertical: 35,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        backgroundColor: '#f9f9f9',  
        position: 'relative',
    },

    discountImage: {
        width: 300,
        height: 100,
        borderRadius: 12,
        paddingHorizontal: 200,
    },
    carouselImage: {
        width: width,  
        height: 269,
        resizeMode: 'cover',
    },

    dotsContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 7,
        backgroundColor: 'rgba(238, 231, 231, 0.53)',
        marginHorizontal: 4,
        right: -140,
    },
    activeDot: {
        backgroundColor: 'rgb(230, 153, 51)',
    },

    totalPriceImage: {
        width: 405,  
        height: 63,   
        position: 'absolute', 
        left: -8,           
    },
});