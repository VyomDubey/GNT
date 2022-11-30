import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, RefreshControl, ScrollView} from 'react-native';
import { useType } from '../App';
import styles from '../App.css'
import Detail from './Detail';
import Livetv from './Livetv';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function Photolist(props){
       
        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);
        const [category, setcategory] = useState(false);
        const [type, setType] = useState('photolist');
        const [pagination, setPagination] = useState(1);
        const [url, setUrl] = useState("");
        const [loader, setLoader] = useState(false);
        const [isLoadMore, setIsLoadMore] = useState(1);
        const [refresh, setRefresh] = useState(false);
        const {propType} = useType();
        const [title, setTitle] = useState("ोटो");

        const getResponseFromApi = (()=>{
            setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/photolist`);
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/photolist`).then((response) => {
            setTopics(response.data.data.photo);
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
            let newContent = [...topics, ...response.data.data.photo]
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
                    </View>
        )
}