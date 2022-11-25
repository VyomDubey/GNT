import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StoryDetail from './StoryDetail';
import PhotoDetail from './PhotoDetail';
import VideoDetail from './VideoDetails';

export default function Screen(props){

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
                    }
                });

        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);
        const [category, setCategory] = useState([]);
        const [type, setType] = useState("");

        useEffect(() => {
            axios.get("https://lingoappfeeds.intoday.in/gnt/appapi/v2/home").then((response) => {
                setTopics(response.data.data);
                console.log(response.data.data.length);
            })
        },[])

        function switchComponent(r) {
            setType(r.n_type);
            setData(r);
            setCategory(true);
        }

        return  (
            type=="story"?<StoryDetail navigation={props.navigation} category={data}/>
                            :type=="photogallery"?<PhotoDetail navigation={props.navigation} category={data}/>
                            :type=="videogallery"?<VideoDetail navigation={props.navigation} category={data}/>
            :<View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity 
                        style={{alignItems:"flex-end",margin: 16}}
                        onPress={props.navigation.openDrawer}
                    >
                    
                    </TouchableOpacity>
                        <ScrollView>
                    {topics.map((r,index) => {
                    return (
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "column"}} key = {index}>
                        <Text style={styles.headings}>{r.title}</Text>
                        <View>
                        {
                            topics[index].news.map((news,index1) => {
                                return(
                                    <View key={index1}>
                                        <TouchableOpacity 
                                            style={{alignItems:"flex-end",margin: 16}}
                                            onPress={()=>switchComponent(news)}
                                        >
                                        <Text style = {styles.text}>{news.n_title}</Text>
                                    <Image
                                        source={{uri:news.n_small_image}}
                                        style = {{ width: "100%", height: 200, margin: (5,5,5,5)}}
                                    />
                                    </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                        </View>
                    </View>
                    );
                    })}
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
}