import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView} from 'react-native';
import RenderHTML from 'react-native-render-html';
import Moment from 'react-moment';

export default function PhotoDetail(props){
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
                    }
                });

        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);

        useEffect(() => {
            if(props.category.p_id!=undefined){
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/photodetail?id=${props.category.p_id}`).then((response) => {
                setTopics(response.data.data.photo);
                setData(response.data.data);
            //    setAuthor(response.data.data.author)
            })
            }
            else{
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/photodetail?id=${props.category.n_id}`).then((response) => {
                setTopics(response.data.data.photo);
                setData(response.data.data);
            //    setAuthor(response.data.data.author)
            })
            }
        },[])


        return  (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                        <ScrollView>
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "column",
                        padding: 5}}>
                            <Text style = {styles.text}>{data.title}</Text>
                            {topics.map((r,index) => {
                                return (
                                    <View key = {index}>
                                        <TouchableOpacity 
                                                    style={{alignItems:"flex-end",margin: 5}}
                                                //    onPress={()=>switchComponent(r)}
                                                >
                                                <Text style = {styles.text}>
                                                    <RenderHTML source={{html: r.p_caption}}/>
                                                </Text>
                                            <Image
                                                source={{uri:r.p_image}}
                                                style = {{ width: "100%", height: 200, margin: (5,5,5,5), alignSelf:"center"}}
                                            />
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