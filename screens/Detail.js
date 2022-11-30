import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import PhotoDetail from './PhotoDetail';
import StoryDetail from './StoryDetail';
import VideoDetail from './VideoDetails';

export default function Detail(props){

    const [category, setCategory] = useState('');

    useEffect(()=>{
        setCategory(props.category);
    },[props])
       
        return  (
            props.category=="story"?<StoryDetail navigation={props.navigation} category={props.data}/>
                        :(props.category=="photolist" || props.category=="photogallery")?<PhotoDetail navigation={props.navigation} category={props.data}/>
                        :<VideoDetail navigation={props.navigation} category={props.data}/>
        )
}