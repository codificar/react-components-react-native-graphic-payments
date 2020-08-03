import React, { Component } from 'react'
import { View, StyleSheet, PixelRatio, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'

//moment date
import moment from 'moment'

//Graphic
import { LineChart } from "react-native-chart-kit"

// axios request api
import axios from 'axios'


class ReportMainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            providerId: this.props.providerId,
            providerToken: this.props.providerToken,
            year: this.props.year,
            routeReport: this.props.routeReport,
            isLoading: false,
            total: 0,
            arrayLineGraphic: [],
            arrayReport: []
        }
    }


    componentDidMount() {
        let currentYear = moment().format('YYYY')
        this.getReport(currentYear)
    }


    getReport = (year) => {
        axios.get(this.props.routeReport, {
            params: {
                provider_id: this.state.providerId,
                token: this.state.providerToken,
                year: this.state.year
            }
        }).then(response => {
            let responseJson = response.data
            if (responseJson.success == true) {
                let arrayResponse = []
                let lineGraphic = { labels: [], datasets: [] }
                let arrayValues = []
                let formattedList = []
                arrayResponse = responseJson.finance

                //Fill the line graphic values and create a formmated array month
                for (let i = 0; i < arrayResponse.length; i++) {
                    lineGraphic.labels.push(moment().locale("pt").month(arrayResponse[i].month - 1).format('MMM'))
                    arrayValues.push(arrayResponse[i].value * 100)
                    formattedList.push({
                        id: i,
                        month: moment().locale("pt").month(arrayResponse[i].month - 1).format('MMM'),
                        value: arrayResponse[i].value, year: year
                    })
                }

                lineGraphic.datasets.push({ data: arrayValues, strokeWidth: 2 })
                this.setState({
                    arrayLineGraphic: lineGraphic,
                    arrayReport: formattedList,
                    isLoading: false,
                    total: responseJson.current_balance
                })
                let responseRequest = response
                this.props.returnRequest(responseRequest)
            } else {
                let responseRequest = response
                this.setState({ isLoading: false })
                this.props.returnRequest(responseRequest)
            }
        }).catch(error => {
            let responseRequest = error
            this.props.returnRequest(responseRequest)
            console.log(error)
        })

    }


    openDetail(item) {
        let formattedMonth = moment().month(item.month).format('MM')
        let startOfMonth = moment(item.year + formattedMonth, 'YYYY-MM').startOf('month').format('DD/MM/YYYY')
        let endtOfMonth = moment(item.year + formattedMonth, 'YYYY-MM').endOf('month').format('DD/MM/YYYY')
        this.props.returnSelectedItem({ startDate: startOfMonth, endDate: endtOfMonth })
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contReceived}>
                    <View style={styles.contTotalValue}>
                        <Text style={styles.txtTotal}>{this.props.currency} {this.state.total}</Text>
                    </View>
                    <Text style={styles.txtReceived}>{this.props.paymentSubtitle}</Text>
                </View>
                <View style={styles.bodyMain}>
                    <View style={styles.contChart}>
                        {this.state.arrayLineGraphic.datasets !== undefined ? (
                            <LineChart
                                data={this.state.arrayLineGraphic}
                                withHorizontalLabels={false}
                                withOuterLines={false}
                                width={Dimensions.get('window').width}
                                height={250}
                                chartConfig={{
                                    withOuterLines: false,
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(0, 113, 225, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    propsForBackgroundLines: {
                                        strokeDasharray: "4", // solid background lines with no dashes
                                        strokeWidth: .25,
                                        stroke: `rgba(0, 0, 0, .50)`,
                                    }
                                }}
                            />
                        ) : null}
                    </View>
                    <View style={styles.contDates}>
                        {/*<View style={styles.contDropdown}>
                            <Dropdown
                                label=''
                                value={moment().format('YYYY')}
                                data={this.state.listYears}
                                containerStyle={styles.dropContStyle}
                                pickerStyle={styles.dropPickerStyle}
                                inputContainerStyle={styles.dropInputContainerStyle}
                                baseColor='#ffffff'
                                textColor='#ffffff'
                                labelHeight={8}
                                onChangeText={(value) => this.props.getReport(value)}
                            />
                            </View>*/}
                    </View>
                </View>
                <View style={styles.bodySec}>
                    <View>
                        <FlatList
                            data={this.state.arrayReport}
                            keyExtractor={item => `${item.id}`}
                            scrollEnabled={true}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity style={[styles.containerButtonDetail, { backgroundColor: index % 2 == 0 ? '#D8D8D8' : '#ffffff' }]}
                                    onPress={() => this.openDetail(item)}>
                                    <View style={styles.flatReportBtn}>
                                        <View style={styles.flatReportCont}>
                                            <Text style={styles.txtCustomer}>{item.month}</Text>
                                        </View>
                                        <View style={styles.contReportValue}>
                                            <Text style={styles.txtReportValue}>{this.props.currency} {parseFloat(item.value).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )} />
                    </View>
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    containerTabs: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonTypeRequests: {
        flex: 0.5,
        alignItems: "center",
        backgroundColor: '#ffffff',
        paddingTop: 20,
        height: 60
    },
    txtButtonRequests: {
        fontSize: 14,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1 / PixelRatio.get()
    },
    styleButtomArea1: {
        borderBottomColor: '#f36752',
        borderBottomWidth: 2,
        fontWeight: 'bold',
        color: '#000000'
    },
    styleButtomArea2: {
        borderBottomColor: '#eef2f6',
        borderBottomWidth: 1,
        color: '#D8D8D8'
    },
    containerButtonDetail: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8
    },
    contReceived: {
        width: '90%',
        alignSelf: 'center'
    },
    txtReceived: {
        fontFamily: 'Roboto',
        fontSize: 11,
        color: '#000000',
        marginTop: 10,
        fontWeight: 'bold'
    },
    bodyMain: {
        width: '100%',
        marginTop: 10,
        marginRight: 25
    },
    contChart: {
        width: '100%',
        marginLeft: -20
    },
    contTotalValue: {
        flexDirection: 'row'
    },
    txtTotal: {
        fontFamily: 'Roboto',
        fontSize: 40,
        fontWeight: 'bold',
        marginRight: 7,
        color: '#000000'
    },
    contDates: {
        flexDirection: 'row'
    },
    bodySec: {
        flex: 1,
        backgroundColor: '#fbfbfb',
        marginTop: 10
    },
    flatReportBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatReportCont: {
        width: '50%'
    },
    txtCustomer: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10
    },
    contReportValue: {
        width: '50%'
    },
    txtReportValue: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#848484',
        alignSelf: 'flex-end',
        marginRight: 10
    },
})

export default ReportMainScreen