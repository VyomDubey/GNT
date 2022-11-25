import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image,ScrollView} from 'react-native';

export default function LatestNews(props){
        const styles = StyleSheet.create({
                    container: {
                        flex:   1,
                        backgroundColor:    "#FFF"
                    },
                    text:   {
                        fontWeight: 700,
                        color:  "#161924",
                        fontSize: 20,
                        fontWeight: "500"
                    },
                    headings:{
                        fontWeight: 900,
                        color:  "#161924",
                        fontSize: 24,
                        fontWeight: "500"
                    },
                    embedded:{
                        lineHeight: 25,
                        fontSize: 20
                    },
                    mainImage:{
                        width: 350, 
                        height: 200,
                        margin: (5,5,5,5), 
                        alignSelf: "center"
                    },
                    authorImage:{
                        width: 80, 
                        height: 50, 
                        margin: (5,5,5,5)
                    },
                    highlight:{
                        padding: 4, 
                        color:"#000", 
                        fontSize:18, 
                        fontWeight:700, 
                        marginTop:8, 
                        backgroundColor:"#d1d1d1", 
                        width: "100%", 
                        alignItems:"center", 
                        justifyContent:"center"
                    },
                    border:{
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: 'black'
                    }
                });

        const [data, setData] = useState([]);
        const [latest, setLatest] = useState([]);

        useEffect(() => {
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/internal_newslist`).then((response) => {
                setData(response.data.data);
                setLatest(response.data.data.news);
            })
        },[])

        return  (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity 
                        style={{alignItems:"flex-end",margin: 16}}
                        onPress={props.navigation.openDrawer}
                    >
                    
                    </TouchableOpacity>
                        <ScrollView>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection:"column"}}>
                        <Text style={styles.text}>
                            {data.title}
                        </Text>
                        {latest?.map((r,index) => {
                        return (
                            <View key = {index}>
                                <TouchableOpacity 
                                            
                                        //    onPress={()=>switchComponent(r)}
                                        >
                                            <View style={{flexDirection: "row", width: "80%", margin: (10,10,10,10)}}>
                                        <Text style = {styles.text}>{r.n_title}</Text>
                                    <Image
                                        source={{uri:r.n_small_image}}
                                        style = {{ width: "20%", height: 50}}
                                    />
                                    </View>
                                    </TouchableOpacity>
                            </View>
                        );
                        })}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
}