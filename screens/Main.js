import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, RefreshControl, ScrollView, useWindowDimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Livetv from './Livetv';
import PhotoDetail from './PhotoDetail';
import StoryDetail from './StoryDetail';
import VideoDetail from './VideoDetails';
import { useType } from '../App';
import styles from '../App.css'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function Main(props){

        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);
        const [category, setcategory] = useState(false);
        const [type, setType] = useState("");
        const [pagination, setPagination] = useState(1);
        const [url, setUrl] = useState("");
        const [loader, setLoader] = useState(false);
        const [isLoadMore, setIsLoadMore] = useState(1);
        const [refresh, setRefresh] = useState(false);
        const {propType} = useType();

        const getResponseFromApi = (()=>{
            if(props.route.params.navigationItemId=="261669"){
                setUrl("https://lingoappfeeds.intoday.in/gnt/appapi/v2/home");
                axios.get("https://lingoappfeeds.intoday.in/gnt/appapi/v2/home").then((response) => {
                setTopics(response.data.data);
            //    loadmore();
            })
            }
            else if(props.route.params.type=="newslist"){
                setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/newslist?id=${props.route.params.navigationItemId}`);
                axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/newslist?id=${props.route.params.navigationItemId}`).then((response) => {
                    setTopics(response.data.data.news);
                    loadmore();
                })
            }
            else if(props.route.params.type=="photolist"){
                setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/photolist`);
                axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/photolist`).then((response) => {
                setTopics(response.data.data.photo);
                loadmore();
            })
            }
            else if(props.route.params.type=="videolist"){
                setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/videolist`);
                axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/videolist`).then((response) => {
                setTopics(response.data.data.video);
                loadmore();
            })
            }
        })

        useEffect(() => {
            setcategory(false);
            setType(props.route.params.type);
            getResponseFromApi();
        },[props])

        useEffect(()=>{
            if(propType=="livetv"){
                setType("livetv");
            }
        },[propType])

        useEffect(()=>{
            if(category==true){
                props.route.params.backButton(props.route.params.title);
            }
        },[category])

        function switchComponent(r) {
            if(type=="newslist"){
            setType(r.n_type);
            }
            setData(r);
            setcategory(true);
        }

        const toggleLivetv=()=> {
            setType("livetv");
        }

        const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 400;
            return layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
          };

        const loadmore = () => {
            if(loader==false && isLoadMore==1 && url!=""){
            setPagination(pagination+1);
            setLoader(true);
            let loadmoreUrl="";
            if(type=="newslist"){
                loadmoreUrl=`${url}&cpageno=${pagination}`
            }
            else{
                loadmoreUrl=`${url}?cpageno=${pagination}`
            }
            axios.get(loadmoreUrl).then((response) => {
                if(response.data.data.news_count<10){
                    setIsLoadMore(0);
                }
                if(type=="newslist"){
                    let newContent = [...topics, ...response.data.data.news]
                    setTopics(newContent);
                }
                else if(type=="photolist"){
                    let newContent = [...topics, ...response.data.data.photo]
                    setTopics(newContent);
                }
                else if(type=="videolist"){
                    let newContent = [...topics, ...response.data.data.video]
                    setTopics(newContent);
                }
                setLoader(false);
            })
        }
        }

        const onRefresh = React.useCallback(() => {
            setPagination(1);
            setIsLoadMore(1);
            setRefresh(true);
            getResponseFromApi();
            wait(2000).then(() => setRefresh(false));
          }, []);        

        const navigate=(title)=>{
            props.navigation.navigate(title);
        }

        const layout = useWindowDimensions();
        

        return  (
            category?type=="story"?<StoryDetail navigation={props.navigation} category={data}/>
                                    :(type=="photogallery" || type=="photolist")?<PhotoDetail navigation={props.navigation} category={data}/>
                                      :<VideoDetail navigation={props.navigation} category={data}/>
            :(type=="newslist"?(props.route.params.navigationItemId=="261669"?
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    
                        <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refresh}
                                onRefresh={onRefresh}
                             />
                        }
                        >
                    {topics.map((r,index) => {
                    return (
                        <View style={{flex: 1,flexDirection: "column"}} key = {index}>
                        {index==0?<Text style={[styles.headings, styles.border]}>{r.title}</Text>
                            :<TouchableOpacity onPress={()=>navigate(r.title)}>
                            <View  style={[styles.border,{flexDirection:"row", justifyContent:"space-between"}]}>
                            <Text style={styles.headings}>{r.title}</Text>
                            <MaterialIcons name="arrow-forward-ios"
                            size={25}
                            color="black"
                            underlayColor="rgba(255,255,255,255)"
                            selectionColor="rgba(255,255,255,255)"
                            backgroundColor="rgba(255,255,255,255)"
                            style={{marginTop:"2%", marginRight:"1%"}}
                            />
                            </View>
                        </TouchableOpacity>}
                        <View>
                        {
                            topics[index].news.map((news,index1) => {
                                return(
                                    <View key={index1}>
                                        <TouchableOpacity 
                                            style={{alignItems:"flex-end"}}
                                            onPress={()=>switchComponent(news)}
                                        >
                                    <Image
                                        source={{uri:news.n_small_image}}
                                        style = {{ width: "100%", height: 200}}
                                    />
                                    {
                                        news.n_type==="videogallery" && 
                                        <View style={{position: 'absolute', top: "40%", left: 0, right: "80%", bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection:"row"}}>
                                        <MaterialIcons name='videocam' size={20}/>
                                        <Text style={styles.text}>{news.n_video[0].nv_duration}</Text>
                                        </View>
                                    }
                                    <Text style = {[styles.text, {alignSelf:"flex-start"}]}>{news.n_title}</Text>
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
            :<View style={styles.container}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                         />
                    }
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                          loadmore();
                        }
                      }}
                      scrollEventThrottle={400}
                    >
                        <View >
                        {topics.map((r,index) => {
                            var temp=index%2
                        return (
                            <View key = {index} style={{backgroundColor:temp==0?"white":"#e1e1e1",display:"flex"}}>
                                <TouchableOpacity
                                            onPress={()=>switchComponent(r)}
                                        >
                                <View style={{display:"flex", flexDirection:"row", padding:(10)}}>
                                        <Text style = {[styles.text, {flex:1, width:"70%"}]}>{r.n_title}</Text>
                                    <Image
                                        source={{uri:r.n_small_image}}
                                        style = {{ width:"20%", height: 50}}
                                    />
                                </View>
                                </TouchableOpacity>
                            </View>
                        );
                        })}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>)
            :
            type=="photolist"?(<View style={styles.container}>
            <SafeAreaView style={{backgroundColor:  "#012039", flex: 1}}>
                <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                     />
                }
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                      loadmore();
                    }
                  }}
                  scrollEventThrottle={400}
                >
                    <View>
                    {topics.map((r,index) => {
                    return (
                        <View key = {index}>
                            <TouchableOpacity 
                                        onPress={()=>switchComponent(r)}
                                    >
                                <Image
                                    source={{uri:r.p_large_image}}
                                    style = {{ width: "100%", height: 200, margin: (5,5,5,5), alignSelf:"center"}}
                                />
                                <View style={{ width: "100%", padding:(0,0,0,0)}}>
                                    <Text style = {styles.photo_caption}>{r.p_title}</Text>
                                    <Text style = {{fontSize:14, color:"#FFF"}}>{r.p_count} PHOTOS</Text>
                                </View>
                                </TouchableOpacity>
                        </View>
                    );
                    })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>)
        :(
            type=="livetv"?    <Livetv  navigation={props.navigation}/>
            :
            <View style={styles.container}>
            <SafeAreaView style={{backgroundColor:  "#012039", flex: 1}}>
                <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                     />
                }
                onScroll={({nativeEvent}) => {
                    if (isCloseToBottom(nativeEvent)) {
                      loadmore();
                    }
                  }}
                  scrollEventThrottle={400}
                >
                    <View>
                    {topics.map((r,index) => {
                    return (
                        <View key = {index}>
                            <TouchableOpacity
                                        onPress={()=>switchComponent(r)}
                                    >
                                <Image
                                    source={{uri:r.v_large_image}}
                                    style = {{ width: "100%", height: 200, marginVertical:5, alignSelf:"center"}}
                                />
                                <View style={{position: 'absolute', top: "40%", left: 0, right: "80%", bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection:"row"}}>
                                <MaterialIcons name='videocam' size={20}/>
                                <Text style = {{backgroundColor:"black", color:"#FFF"}}>{r.v_duration}</Text>
                                </View>
                                <View style={{width: "100%", padding:0}}>
                                    <Text style = {styles.photo_caption}>{r.v_title}</Text>
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
            )
        )
}