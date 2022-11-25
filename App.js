import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer, TabActions } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer'
import 'react-native-gesture-handler';
import axios from 'axios';
import {
  HomeScreen,
} from "./screens";
import Main from "./screens/Main";
import AnimatedSplash from "react-native-animated-splash-screen";
import { loadAsync } from "expo-font";
import { useWindowDimensions, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();
const AppContext = createContext();

export default function App(){

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }
  });

  const [menu, setMenu] = useState([]);
  const [isLoaded, setIsLoaded] =useState(false);
  const [splashLogo, setSplashLogo] = useState("");
  const [back, setBack] = useState(false);
  const [backScene, setBackScene] = useState("होम");
  const [propType, setType] = useState("newslist");
  const layout = useWindowDimensions();
  
  const backButton =(title) => {
    setBackScene(title);
    setBack(true);
  }

  const getSplash =async()=>{
    await axios.get("https://lingoappfeeds.intoday.in/gnt/appapi/splash_screen").then((response) => {
      setSplashLogo(response.data.data.background.android.phone.hdpi);
    //  setMenu(rrp)
    })
  }

  useEffect(()=>{
    getSplash();
    axios.get("https://lingoappfeeds.intoday.in/gnt/appapi/hamburger_menu").then((response) => {
      setMenu(response.data.data.hamburger_menu[0].menu);
      setTimeout(()=>{
        setIsLoaded(true);
      },5)
    //  setMenu(rrp)
    })
  },[])


  const goBack=(navigation) => {
      setType("");
      console.log(backScene)
      navigation.navigate(backScene);
      setBack(false);
  }

  const toggleLiveTv=()=>{
    setBack(true);
    setType("livetv");
  }



  return(
    splashLogo!="" ? 
    <AppContext.Provider value={{propType}}>
    <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={{uri:splashLogo}}
      //  backgroundColor={"#262626"}
        logoHeight={layout.height}
        logoWidth={layout.width}
    >
    <NavigationContainer>
    <Drawer.Navigator screenOptions={({navigation})=>({
        overlayColor: "transparent",
        drawerType: "slide",
        drawerStyle: { flex: 1, width: "70%", paddingRight: 20, backgroundColor: "transparent" },
        sceneContainerStyle: { backgroundColor: "transparent" },
        headerShown: true,
        headerTitleStyle: {fontSize:24},
        headerStyle: {
          backgroundColor: 'red',
        },
        headerRight:()=>(
          <MaterialIcons.Button 
          name="live-tv"
          size={25}
          color="rgba(255,255,255, 255)"
          underlayColor="transparent"
          selectionColor="transparent"
          backgroundColor="transparent"
          onPress={toggleLiveTv}
              />
        )
        })}>
        {menu.length>0 ?menu.map((r,index) => {
          return (
            <Drawer.Screen
              key={index}
              options={({navigation})=>
              ({headerLeft:()=>back==true?
                          <MaterialIcons.Button 
                           name="keyboard-backspace"
                           size={24}
                           overlayColor="transparent"
                           backgroundColor="transparent"
                           onPress={()=>goBack(navigation)}
                          /> :
                          <MaterialIcons.Button 
                           name="dehaze"
                           size={24}
                           overlayColor="transparent"
                           backgroundColor="transparent"
                           onPress={navigation.openDrawer}
                           />
                           })}
              name={r.title}
              component={Main}
              initialParams={{navigationItemId: r.id, type: r.type, backButton: backButton, title: r.title}}
            />
          );
        })
      :<Drawer.Screen name="ोम" component={HomeScreen} />}
    </Drawer.Navigator>
    </NavigationContainer>
    </AnimatedSplash>
    </AppContext.Provider>
    :<View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator/>
    </View>
  )
}

export const useType = () => useContext(AppContext);
