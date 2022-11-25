import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import Moment from 'react-moment';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';

export default function StoryDetail(props){
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

        const [author, setAuthor] = useState([]);
        const [topics, setTopics] = useState([]);
        const [embedded, setEmbedded] = useState("");
        const {width} = useWindowDimensions();

        useEffect(() => {
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/storydetail?id=${props.category.n_id}`).then((response) => {
                setTopics(response.data.data);
                setAuthor(response.data.data.author);
                setEmbedded(response.data.data.desc_withembedded.replace("<ITG-NATIVEAPP>ADS<ITG-NATIVEAPP>",""));
            })
        },[])

        const renderers ={
            iframe: IframeRenderer
        };

        const customHTMLElementModels ={
            iframe: iframeModel
        };

        return  (topics?.highlight?.length>0 ?
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    <TouchableOpacity 
                        style={{alignItems:"flex-end",margin: 16}}
                        onPress={props.navigation.openDrawer}
                    >
                    
                    </TouchableOpacity>
                        <ScrollView>
                        <View style={{flex: 1, flexDirection: "column"}}>
                        <View>
                            <Text style = {styles.text}>{topics.title}</Text>
                                <Image
                                    source={{uri:topics.large_image}}
                                    style = {styles.mainImage}
                                />
                            <Text  style={{paddingLeft:10}}>{topics.image_caption}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            {<Image
                                source={{uri:author.a_image}}
                                style = {styles.authorImage}
        />}
                            <View style={{flexDirection: "column"}}>
                                <Text>
                                    {topics.a_title}
                                </Text>
                                <Text>
                                    {topics.location}, {topics.published_datetime}
                                </Text>
                                <Text>
                                    Updated {topics.updated_datetime}
                                </Text>
                                   { /*<Moment format="DD/MMM">
                                        {topics.published_datetime}
    </Moment>*/}
                                
                            </View>
                        </View>
                        <View style={styles.highlight}>
                                <Text>
                                    हाइलाइट्स
                                </Text>
                        </View>
                        {topics?.highlight?.map((text)=>{
                            return(
                            <Text style={styles.border}>
                                {text.h_title}
                            </Text>)
                        })}
                        <RenderHTML 
                        contentWidth={width}
                        renderers={renderers}
                        source={{html: embedded}} style={styles.embedded}
                        customHTMLElementModels={customHTMLElementModels}
                        WebView={WebView}
                        />
                    </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
            :
            <View></View>
        )
}