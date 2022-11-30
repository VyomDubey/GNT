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

export default function Newslist(props){
       
        const [data, setData] = useState([]);
        const [topics, setTopics] = useState([]);
        const [category, setcategory] = useState(false);
        const [type, setType] = useState('newslist');
        const [pagination, setPagination] = useState(1);
        const [url, setUrl] = useState("");
        const [loader, setLoader] = useState(false);
        const [isLoadMore, setIsLoadMore] = useState(1);
        const [refresh, setRefresh] = useState(false);
        const {propType} = useType();
        const [title, setTitle] = useState('');

        const getResponseFromApi = (()=>{
            setUrl(`https://lingoappfeeds.intoday.in/gnt/appapi/newslist?id=${props.itemId}`);
            axios.get(`https://lingoappfeeds.intoday.in/gnt/appapi/newslist?id=${props.itemId}`).then((response) => {
                setTopics(response.data.data.news);
                setTitle(response.data.data.title);
                loadmore();
            })
        })

        useEffect(() => {
            setType(props.type);
            setcategory(false);
            getResponseFromApi();
        },[])

        useEffect(()=>{
            if(propType=="livetv"){
                setType("livetv");
            }
        },[propType])

        useEffect(()=>{
            if(category==true){
                console.log(title);
                props.backButton(title);
            }
        },[category])

        function switchComponent(r) {
            if(type=="newslist"){
                setType(r.n_type);
            }
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
            loadmoreUrl=`${url}&cpageno=${pagination}`
            axios.get(loadmoreUrl).then((response) => {
                if(response.data.data.news_count<10){
                    setIsLoadMore(0);
                }
                let newContent = [...topics, ...response.data.data.news]
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


        return  (topics?.length>0 ?
            category?<Detail navigation={props.navigation} category={type} data={data}/>
            :type=="livetv"?    <Livetv  navigation={props.navigation}/>
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
                        <View>
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
            </View>
            :<View></View>
        )
}