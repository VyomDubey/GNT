import React from "react";
import Screen from "./Screen";
import StoryDetail from "./StoryDetail";
import Main from "./Main";

export const MainScreen = ({navigation}) => <Main navigation={navigation} type={type} name="MainScreen" />
export const StoryScreen = ({navigation}) => <StoryDetail navigation={navigation} name="StoryDetail" />
export const HomeScreen = ({navigation}) => <Screen navigation={navigation} name="ोम" />
export const ProfileScreen = ({navigation}) => <Screen navigation={navigation} name="Profile" />
export const MessageScreen = ({navigation}) => <Screen navigation={navigation} name="Message" />
export const ActivityScreen = ({navigation}) => <Screen navigation={navigation} name="Activity" />
export const ListScreen = ({navigation}) => <Screen navigation={navigation} name="List" />
export const ReportScreen = ({navigation}) => <Screen navigation={navigation} name="Report" />
export const StatisticScreen = ({navigation}) => <Screen navigation={navigation} name="Statistic" />
export const SignOutScreen = ({navigation}) => <Screen navigation={navigation} name="SignOut" />

