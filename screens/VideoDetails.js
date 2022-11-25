import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView} from 'react-native';
import RenderHTML from 'react-native-render-html';
import Moment from 'react-moment';
import VideoPlayer from 'react-native-video-player';

export default function VideoDetail(props){
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

        const [topics, setTopics] = useState([]);

        useEffect(() => {
            if(props.category.v_id!=undefined){
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/videodetail?id=${props.category.v_id}`).then((response) => {
                setTopics(response.data.data[0]);
            })
            }
            else{
                axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/videodetail?id=${props.category.n_id}`).then((response) => {
                setTopics(response.data.data[0]);
            })
            }
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
                        <View style={{flex: 1, flexDirection: "column", padding: 5}}>
                            <Text style = {styles.text}>{topics.v_title}</Text>
                                <VideoPlayer
                                    video={{ uri: topics.v_url }}
                                    videoWidth={1600}
                                    videoHeight={900}
                                    thumbnail={{ uri: topics.v_large_image }}
                                    autoplay
                                    disableFullscreen={false}
                                />
                                <View style={{flexDirection: "row"}}>
                            {/*<Image
                                source={{uri:author.a_image}}
                                style = {{ width: 80, height: 50, margin: (5,5,5,5)}}
        />*/}
                            <View style={{flexDirection: "column", marginVertical:10}}>
                                <Text>
                                    {topics.v_byline}
                                </Text>
                                <Text>
                                    Updated {topics.v_updated_datetime}
                                </Text>
                                
                            </View>
                        </View>
                            <Text>{topics.v_short_desc}</Text>
                    </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
}