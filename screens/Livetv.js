import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';
import LatestNews from './LatestNews';

export default function Livetv(props){

    const layout = useWindowDimensions();

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
                    noLabel: {
                        display: 'none',
                        height: 0
                    },
                    bubble: {
                        backgroundColor: 'lime',
                        paddingHorizontal: 18,
                        paddingVertical: 12,
                        borderRadius: 10
                    },
                });

        const [livetv, setLivetv] = useState([]);
        const [title, setTitle] = useState("Good News Today Live TV");

        useEffect(() => {
            axios.get(`https://lingoappfeeds.intoday.in/gnt/api/livetv?id=livetv`).then((response) => {
                setLivetv(response.data.data.live_tv);
            })
        },[])

        const renderers ={
            iframe: IframeRenderer
        };

        const customHTMLElementModels ={
            iframe: iframeModel
        };

        const FirstRoute = () => (
            livetv.length>0 && <RenderHTML 
                        contentWidth={layout}
                        renderers={renderers}
                        source={{html: livetv[0].iframe}} style={styles.embedded}
                        customHTMLElementModels={customHTMLElementModels}
                        WebView={WebView}
                        />
        );
        const SecondRoute = () => (
            livetv.length>0 && <RenderHTML 
                        contentWidth={layout}
                        renderers={renderers}
                        source={{html: livetv[1].iframe}} style={styles.embedded}
                        customHTMLElementModels={customHTMLElementModels}
                        WebView={WebView}
                        />
        );

        const AajtakHdRoute = () => (
            livetv.length>0 && <RenderHTML 
                        contentWidth={layout}
                        renderers={renderers}
                        source={{html: livetv[2].iframe}} style={styles.embedded}
                        customHTMLElementModels={customHTMLElementModels}
                        WebView={WebView}
                        />
        );

        const IndiaTodayRoute = () => (
            livetv.length>0 && <RenderHTML 
                        contentWidth={layout}
                        renderers={renderers}
                        source={{html: livetv[3].iframe}} style={styles.embedded}
                        customHTMLElementModels={customHTMLElementModels}
                        WebView={WebView}
                        />
        );
           
        const getTabBarIcon = (props) => {

            const {route} = props
        
              if (route.key === 'gnt' && livetv?.length>0) {
               return (livetv?.length>0 && <Image
                source={{uri:livetv[0].icon}}
                style = {{ width: 25, height: 25}}
                />)

        
              } else if(route.key === 'aajtak'  && livetv?.length>0){
                return (livetv?.length>0 && <Image
                    source={{uri:livetv[1].icon}}
                    style = {{ width: 25, height: 25}}
                    />)
        
              }
              else if(route.key === 'aajtakHd'  && livetv?.length>0){
                return (livetv?.length>0 && <Image
                    source={{uri:livetv[2].icon}}
                    style = {{ width: 25, height: 25}}
                    />)
        
              }
              else if(route.key === 'indiatoday' && livetv?.length>0){
                return (livetv?.length>0 && <Image
                    source={{uri:livetv[3].icon}}
                    style = {{ width: 25, height: 25}}
                    />)
              }
        }
          const renderScene = SceneMap({
            gnt: FirstRoute,
            aajtak: SecondRoute,
            aajtakHd: AajtakHdRoute,
            indiatoday: IndiaTodayRoute,
          });

          const [index, setIndex] = useState(0);
            const [routes] = useState([
                { key: 'gnt', title: 'First' },
                { key: 'aajtak', title: 'Second' },
                { key: 'aajtakHd', title: 'Third' },
                { key: 'indiatoday', title: 'Fourth' },
            ]);

            const renderTabBar = props => (
                <TabBar
                    {...props}
                    renderIcon={
                        props => getTabBarIcon(props)
                    }
                //    tabStyle={styles.bubble}
                    labelStyle={styles.noLabel}
                    activeColor={'white'}
                    inactiveColor={'black'}
                    style={{marginTop:25,backgroundColor:'red'}}
                />
            );


        return  (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 3}}>
                    <TouchableOpacity 
                        style={{alignItems:"flex-end",margin: 16}}
                        onPress={props.navigation.openDrawer}
                    >
                    
                    </TouchableOpacity>
                    <ScrollView>
                        <View>
                            <Text style = {styles.text}>{title}</Text>
                        </View>
                        <TabView
                                style={{height:400}}
                                navigationState={{ index, routes }}
                                renderScene={renderScene}
                                renderTabBar={renderTabBar}
                                onIndexChange={setIndex}
                                initialLayout={{ width: layout.width}}
                                />
                    <LatestNews navigation={props.navigation}/>
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
}