import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, RefreshControl, ScrollView} from 'react-native';
import { useType } from '../App';
import styles from '../App.css'
import Detail from './Detail';
import Livetv from './Livetv';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function Videolist(props){
       
        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);
        const [category, setcategory] = useState(false);
        const [type, setType] = useState('videolist');
        const [pagination, setPagination] = useState(1);
        const [url, setUrl] = useState("");
        const [loader, setLoader] = useState(false);
        const [isLoadMore, setIsLoadMore] = useState(1);
        const [refresh, setRefresh] = useState(false);
        const {propType} = useType();
        const [title, setTitle] = useState("ीडियो");

        const getResponseFromApi = (()=>{
            setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/videolist`);
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/videolist`).then((response) => {
            setTopics(response.data.data.video);
            loadmore();
            })
        })

        useEffect(() => {
            getResponseFromApi();
        },[])

        useEffect(()=>{
            if(propType=="livetv"){
                setType("livetv");
            }
        },[propType])

        useEffect(()=>{
            if(category==true){
                props.backButton(title);
            }
        },[category])

        function switchComponent(r) {
            setData(r);
            setcategory(true);
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
            loadmoreUrl=`${url}?cpageno=${pagination}`
            axios.get(loadmoreUrl).then((response) => {
                if(response.data.data.news_count<10){
                    setIsLoadMore(0);
                }
            let newContent = [...topics, ...response.data.data.video]
            setTopics(newContent);
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


        return  (
            category==true?<Detail navigation={props.navigation} category={type} data={data}/>
            :type=="livetv"?    <Livetv  navigation={props.navigation}/>
            :<View style={styles.container}>
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
}